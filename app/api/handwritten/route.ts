import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import path from "path";
import { adminAuth, adminDb } from "@/firebase/admin";
import { requireGoogleAuth } from "@/lib/requireGoogleAuth";

/* ================= HELPERS ================= */

const rand = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const getTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

/* ================= Q&A FORMATTER ================= */

type QALine = {
  text: string;
  isQuestion: boolean;
  gapAfter?: number;
};

const formatQA = (input: string): QALine[] => {
  const lines = input.split("\n");
  const result: QALine[] = [];
  let pendingGap = 0;

  for (const ln of lines) {
    const t = ln.trim();

    // ✅ GAP COMMAND: [gap:2]
    const gapMatch = t.match(/^\[gap:(\d+)\]$/i);
    if (gapMatch) {
      pendingGap = Number(gapMatch[1]);
      continue;
    }

    if (!t) {
      result.push({ text: "", isQuestion: false });
      continue;
    }

    if (/^q\d*[\.\)]?/i.test(t)) {
      result.push({ text: t, isQuestion: true });
      continue;
    }

    if (/^ans[\.\:]/i.test(t)) {
      result.push({
        text: "  " + t,
        isQuestion: false,
        gapAfter: pendingGap || 0,
      });
      pendingGap = 0;
      continue;
    }

    result.push({
      text: "  " + t,
      isQuestion: false,
      gapAfter: pendingGap || 0,
    });

    pendingGap = 0;
  }

  return result;
};

export async function POST(req: Request) {
  const {
    text,
    mode = "text",
    fontSize = 14,
    inkColor = "blue",
    questionColor = "black",
    fontFamily = "kalam",
    pageStyle = "lined",
    margin = 60,
  } = await req.json();

  if (!text) {
    return NextResponse.json({ error: "Text required" }, { status: 400 });
  }

  /* ================= AUTH ================= */

  const { user, error } = await requireGoogleAuth(req);
if (error) return error;

const uid = user.uid;

  const userRef = adminDb.collection("users").doc(uid);
  let snap = await userRef.get();

  if (!snap.exists) {
    await userRef.set({
      uid,
      plan: "free",
      createdAt: new Date(),
      usage: {
        exportsToday: 0,
        exportReset: getTodayKey(),
      },
    });

    snap = await userRef.get();
  }

  /* ================= FREE EXPORT LIMIT ================= */

  const data = snap.data()!;
  const plan = data.plan || "free";
  const isFreeHandwritten =
  plan === "free" && mode === "text"; // handwritten = text mode


  if (plan === "free") {
    const today = getTodayKey();
    const usage = data.usage || {};
    const exportsToday = usage.exportsToday || 0;
    const lastReset = usage.exportReset;

    if (lastReset !== today) {
      await userRef.update({
        "usage.exportsToday": 0,
        "usage.exportReset": today,
      });
    } else if (exportsToday >= 3) {
      return NextResponse.json(
        { error: "Free export limit reached" },
        { status: 403 }
      );
    }

    await userRef.update({
      "usage.exportsToday": exportsToday + 1,
    });
  }

  /* ================= FONT ================= */

  const fontMap: Record<string, string> = {
    kalam: "Kalam-Regular.ttf",
    caveat: "Caveat-Regular.ttf",
    patrick: "PatrickHand-Regular.ttf",
  };

  const fontPath = path.join(
    process.cwd(),
    "public/fonts",
    fontMap[fontFamily] || fontMap.kalam
  );

  const colorMap: Record<string, string> = {
    blue: "#1a4fff",
    black: "#000000",
    purple: "#6b4eff",
    red: "#d64545",
    green: "#2e9f5b",
  };

  /* ================= DOCUMENT ================= */

  const doc = new PDFDocument({
  size: "A4",
  margins: {
    top: Number(margin),
    bottom: Number(margin),
    left: Number(margin),
    right: Number(margin),
  },
  font: fontPath,
  bufferPages: true, // 🔥 REQUIRED FOR WATERMARK
});


  // 🔒 LOCK FONT (NO HELVETICA FALLBACK)
  doc.registerFont("hand", fontPath);
  doc.font("hand");

  const baseFontSize = Number(fontSize);
  doc.fontSize(baseFontSize);

  const pageHeight = doc.page.height;
  const top = doc.page.margins.top;
  const bottom = doc.page.margins.bottom;

  const baseLineGap = 5;

  /* ================= RULED LINES ================= */

  const drawLines = () => {
    if (pageStyle !== "lined") return;

    for (let y = top + 20; y < pageHeight - bottom; y += 24) {
      doc
        .moveTo(50, y)
        .lineTo(doc.page.width - 50, y)
        .strokeColor("#d0d7ff")
        .lineWidth(0.5)
        .stroke();
    }
  };

  drawLines();


  /* ================= TEXT PREP ================= */

  const logicalLines: QALine[] =
    mode === "qa"
      ? formatQA(text)
      : text.split("\n").map((t: string) => ({
          text: t,
          isQuestion: false,
        }));

  let cursorY = top;

  /* ================= WRITE FUNCTION ================= */

  const writeLine = (
    line: string,
    isQuestion: boolean,
    gapAfter = 0
  ) => {
    if (!line.trim()) {
      cursorY += baseFontSize * 0.4;
      return;
    }

    doc.fontSize(baseFontSize + rand(-1.2, 1.2));
    doc.fillOpacity(rand(0.85, 1));

    const color = isQuestion
      ? colorMap[questionColor] || colorMap.black
      : colorMap[inkColor] || colorMap.blue;

    doc.fillColor(color);

    const maxWidth =
      doc.page.width -
      doc.page.margins.left -
      doc.page.margins.right;

    const textHeight = doc.heightOfString(line, { width: maxWidth });

    if (cursorY + textHeight > pageHeight - bottom) {
      doc.addPage();
      drawLines();

    
      cursorY = top;
    }

    doc.text(line, doc.page.margins.left, cursorY, { width: maxWidth });

    const extraGap = (Number(gapAfter) || 0) * baseFontSize;

    cursorY +=
      textHeight +
      baseLineGap +
      (isQuestion ? baseFontSize * 0.25 : 0) +
      extraGap +
      rand(-1.2, 1.2);
  };

  /* ================= WORD WRAP ================= */

  logicalLines.forEach((item) => {
    let current = "";

    item.text.split(" ").forEach((word) => {
      const test = current + word + " ";

      if (
        doc.widthOfString(test) >
        doc.page.width -
          doc.page.margins.left -
          doc.page.margins.right
      ) {
        writeLine(current, item.isQuestion, item.gapAfter || 0);
        current = word + " ";
      } else {
        current = test;
      }
    });

    writeLine(current, item.isQuestion, item.gapAfter || 0);
  });


  // ================= WATERMARK (DRAW LAST) =================

if (isFreeHandwritten) {
  const pages = doc.bufferedPageRange(); // get all pages

  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);

    doc.save();

    doc
      .rotate(-35, {
        origin: [doc.page.width / 2, doc.page.height / 2],
      })
      .fontSize(60)
      .fillColor("#000000")
      .fillOpacity(0.15)
      .text(
        "AI Videxa • FREE VERSION",
        doc.page.width / 2 - 250,
        doc.page.height / 2,
        {
          width: 500,
          align: "center",
        }
      );

    doc.restore();
  }
}

  /* ================= RESPONSE ================= */

  const buffers: Buffer[] = [];
  doc.on("data", buffers.push.bind(buffers));
  doc.end();
  return new Promise<Response>((resolve) => {
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(buffers);

      resolve(
        new Response(pdfBuffer, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "inline; filename=handwritten.pdf",
          },
        })
      );
    });
  });
}