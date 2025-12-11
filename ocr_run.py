from pathlib import Path
import sys, time, os
import pypdfium2 as pdfium
import pytesseract

pytesseract.pytesseract.tesseract_cmd = r"C:\\Program Files\\Tesseract-OCR\\tesseract.exe"
os.environ["TESSDATA_PREFIX"] = str(Path("tessdata").resolve())

pdf_path = Path("GIÁO TRÌNH CHỦ NGHĨA XÃ HỘI KHOA HỌC (K-2021).pdf")
out_path = Path("ocr_full.txt")

if not pdf_path.exists():
    sys.exit("PDF not found")

start = time.time()
parts = []

with pdfium.PdfDocument(str(pdf_path)) as pdf:
    n_pages = len(pdf)
    print(f"Pages: {n_pages}")
    for i in range(n_pages):
        page = pdf[i]
        pil_image = page.render(scale=200/72).to_pil()
        txt = pytesseract.image_to_string(pil_image, lang='vie')
        parts.append(f"\n\n===== PAGE {i+1} =====\n\n" + txt)
        if (i + 1) % 10 == 0:
            print(f"Processed {i+1}/{n_pages} pages...")

out_path.write_text("".join(parts), encoding='utf-8')
print(f"Done. Wrote {out_path} in {(time.time()-start)/60:.1f} minutes")
