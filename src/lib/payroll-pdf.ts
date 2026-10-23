import { jsPDF } from "jspdf";
import fontAsset from "@/assets/fonts/payroll-regular.ttf.asset.json";
import logoAsset from "@/assets/logo/logo-256.png.asset.json";

export type PayrollPdfData = {
  title: string; netLabel: string; net: string; subtitle: string;
  breakdown: string; rows: readonly (readonly [string, string])[];
  disclaimer: string; source: string; sourceUrl: string;
};
let assets: Promise<{font: string; logo: Uint8Array}> | undefined;
const clean = (text: string) => text.replace(/Confidential/gi, "KPT Consulting L.L.C.").replace(/→/g, " > ");
async function loadAssets() {
  assets ??= Promise.all([fetch(fontAsset.url),fetch(logoAsset.url)]).then(async ([font,logo]) => {
    if (!font.ok || !logo.ok) throw new Error("PDF assets unavailable");
    const bytes = new Uint8Array(await font.arrayBuffer());
    let binary = "";
    for (let i=0;i<bytes.length;i+=8192) binary += String.fromCharCode(...bytes.subarray(i,i+8192));
    return {font:btoa(binary),logo:new Uint8Array(await logo.arrayBuffer())};
  }).catch(error => {assets=undefined;throw error;});
  return assets;
}
function tokenRgb(token: string): [number,number,number] {
  const canvas = document.createElement("canvas");
  canvas.width=1;canvas.height=1;
  const context=canvas.getContext("2d");
  if (!context) throw new Error("Canvas unavailable");
  context.fillStyle=getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  context.fillRect(0,0,1,1);
  const pixel=context.getImageData(0,0,1,1).data;
  return [pixel[0],pixel[1],pixel[2]];
}
export async function createPayrollPdf(data: PayrollPdfData): Promise<Blob> {
  const {font,logo}=await loadAssets();
  const doc=new jsPDF({unit:"mm",format:"a4"});
  doc.addFileToVFS("KptSans.ttf",font);doc.addFont("KptSans.ttf","KptSans","normal");doc.setFont("KptSans");
  doc.setProperties({title:clean(data.title),author:"KPT Consulting L.L.C.",subject:clean(data.breakdown)});
  const primary=tokenRgb("--primary"), foreground=tokenRgb("--foreground"), muted=tokenRgb("--muted-foreground"), border=tokenRgb("--border");
  let y=20;
  const header=() => {
    doc.setFillColor(...primary);doc.rect(0,0,210,3,"F");
    const props=doc.getImageProperties(logo);const lh=14,lw=lh*props.width/props.height;doc.addImage(logo,"PNG",16,12,lw,lh);
    doc.setTextColor(...foreground);doc.setFontSize(15);doc.text("KPT Consulting L.L.C.",18+lw+2,19);
    doc.setFontSize(9);doc.setTextColor(...muted);doc.text("www.kptconsulting.al",18+lw+2,25);
    y=39;
  };
  const ensure=(height:number) => {if(y+height>273){doc.addPage();header();}};
  const paragraph=(value:string,size=10,color=foreground) => {
    doc.setFontSize(size);const lines=doc.splitTextToSize(clean(value),178) as string[];
    for(const line of lines){ensure(size*0.45+2);doc.setTextColor(...color);doc.text(line,16,y);y+=size*0.45+1;}
    y+=3;
  };
  header();paragraph(data.title,21);paragraph(data.subtitle,10,muted);
  paragraph(data.netLabel,11,primary);paragraph(data.net,26,primary);
  y+=3;paragraph(data.breakdown,13);
  for(const [label,value] of data.rows){
    doc.setFontSize(10);const lines=doc.splitTextToSize(clean(label),127) as string[];
    const height=Math.max(11,lines.length*5+5);ensure(height);
    doc.setTextColor(...foreground);doc.text(lines,16,y+5);doc.text(clean(value),194,y+5,{align:"right"});
    doc.setDrawColor(...border);doc.line(16,y+height-1,194,y+height-1);y+=height;
  }
  y+=8;paragraph(data.disclaimer,9,muted);ensure(6);doc.setFontSize(9);doc.setTextColor(...primary);doc.textWithLink(clean(data.source),16,y,{url:data.sourceUrl});doc.setDrawColor(...primary);doc.line(16,y+0.8,16+doc.getTextWidth(clean(data.source)),y+0.8);y+=6;
  for(let page=1;page<=doc.getNumberOfPages();page++){
    doc.setPage(page);doc.setFontSize(8);doc.setTextColor(...muted);
    doc.text("KPT Consulting L.L.C.",16,286);doc.text(`${page} / ${doc.getNumberOfPages()}`,194,286,{align:"right"});
  }
  return doc.output("blob");
}
export async function downloadPayrollPdf(blob: Blob, filename: string) {
  const file=new File([blob],filename,{type:"application/pdf"});
  if (matchMedia("(pointer: coarse)").matches && navigator.canShare?.({files:[file]})) {
    try {await navigator.share({files:[file],title:"KPT Consulting L.L.C."});return;}
    catch(error){if(error instanceof DOMException && error.name==="AbortError") return;}
  }
  const url=URL.createObjectURL(blob);const link=document.createElement("a");
  link.href=url;link.download=filename;document.body.appendChild(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),30000);
}