import SellerLayout from "@/components/SellerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Circle,
  Upload,
  FileSearch,
  FileText,
  PenLine,
  FileCheck,
  CreditCard,
  Lock,
  Download,
  Eye,
  AlertTriangle,
  ArrowLeft,
  SendHorizonal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const timelineSteps = [
  { label: "Beküldve", icon: SendHorizonal, description: "Az ügy sikeresen beküldve." },
  { label: "Dokumentumok feltöltve", icon: Upload, description: "Minden szükséges dokumentum feltöltve." },
  { label: "Dokumentum ellenőrzés", icon: FileSearch, description: "Dokumentumok ellenőrzés alatt." },
  { label: "Adásvételi szerződés elkészítése", icon: FileText, description: "A szerződés előkészítés alatt áll." },
  { label: "Aláírt szerződés feltöltése", icon: PenLine, description: "Töltse fel az aláírt szerződést." },
  { label: "Szolgáltatási szerződés elfogadása", icon: FileCheck, description: "Fogadja el a szolgáltatási szerződést." },
  { label: "Fizetés", icon: CreditCard, description: "Szolgáltatási díj befizetése." },
  { label: "Ügy lezárva", icon: Lock, description: "Az ügy sikeresen lezárva." },
];

const currentStepIndex = 4; // 0-based, step 5 is current

const statusBadgeMap: Record<string, { label: string; className: string }> = {
  submitted: { label: "Beküldve", className: "bg-muted text-muted-foreground" },
  doc_review: { label: "Dokumentum ellenőrzés", className: "bg-warning/15 text-warning border-warning/30" },
  contract_prep: { label: "Szerződés készül", className: "bg-secondary/15 text-secondary border-secondary/30" },
  awaiting_sign: { label: "Aláírásra vár", className: "bg-primary/15 text-primary border-primary/30" },
  payment: { label: "Fizetés folyamatban", className: "bg-warning/15 text-warning border-warning/30" },
  closed: { label: "Lezárt ügy", className: "bg-success/15 text-success border-success/30" },
};

const currentStatus = statusBadgeMap.awaiting_sign;

const documents = [
  { type: "Tulajdoni lap", filename: "tulajdoni_lap_2024.pdf", status: "accepted" },
  { type: "Személyi igazolvány", filename: "szemelyi_ig_scan.pdf", status: "accepted" },
  { type: "Timeshare igazolás", filename: "timeshare_cert.pdf", status: "reviewing" },
  { type: "Adásvételi szerződés", filename: "adasveteli_szerzodes.pdf", status: "problem" },
];

const docStatusMap: Record<string, { label: string; className: string }> = {
  uploaded: { label: "Feltöltve", className: "bg-muted text-muted-foreground" },
  reviewing: { label: "Ellenőrzés alatt", className: "bg-warning/15 text-warning border-warning/30" },
  accepted: { label: "Elfogadva", className: "bg-success/15 text-success border-success/30" },
  problem: { label: "Probléma", className: "bg-destructive/15 text-destructive border-destructive/30" },
};

export default function CaseDetail() {
  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Back link */}
        <Link
          to="/seller/cases"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Vissza az ügyeimhez
        </Link>

        {/* Case Header */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">Ügy száma</p>
                <h1 className="text-2xl font-bold text-foreground">TS-10234</h1>
              </div>
              <Badge className={cn("text-xs font-semibold px-3 py-1", currentStatus.className)}>
                {currentStatus.label}
              </Badge>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Üdülőhely neve</p>
                <p className="font-medium text-foreground">Marriott Vacation Club</p>
              </div>
              <div>
                <p className="text-muted-foreground">Hét száma</p>
                <p className="font-medium text-foreground">32. hét</p>
              </div>
              <div>
                <p className="text-muted-foreground">Létrehozva</p>
                <p className="font-medium text-foreground">2024. november 12.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* LEFT — Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Ügy állapota</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {timelineSteps.map((step, i) => {
                    const completed = i < currentStepIndex;
                    const current = i === currentStepIndex;
                    const future = i > currentStepIndex;
                    const Icon = step.icon;
                    const isLast = i === timelineSteps.length - 1;

                    return (
                      <div key={i} className="flex gap-4 relative">
                        {/* Vertical line */}
                        {!isLast && (
                          <div
                            className={cn(
                              "absolute left-[17px] top-[36px] w-0.5 h-[calc(100%-12px)]",
                              completed ? "bg-success" : current ? "bg-secondary" : "bg-border"
                            )}
                          />
                        )}

                        {/* Icon circle */}
                        <div
                          className={cn(
                            "relative z-10 flex items-center justify-center h-9 w-9 rounded-full shrink-0 border-2 transition-colors",
                            completed
                              ? "bg-success border-success text-success-foreground"
                              : current
                              ? "bg-secondary border-secondary text-secondary-foreground"
                              : "bg-muted border-border text-muted-foreground"
                          )}
                        >
                          {completed ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : current ? (
                            <Icon className="h-4 w-4" />
                          ) : (
                            <Circle className="h-4 w-4" />
                          )}
                        </div>

                        {/* Content */}
                        <div className={cn("pb-8", isLast && "pb-0")}>
                          <p
                            className={cn(
                              "text-sm font-medium leading-tight",
                              completed
                                ? "text-success"
                                : current
                                ? "text-foreground"
                                : "text-muted-foreground"
                            )}
                          >
                            {step.label}
                          </p>
                          <p
                            className={cn(
                              "text-xs mt-1",
                              current ? "text-muted-foreground" : "text-muted-foreground/60"
                            )}
                          >
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT — Details & Documents */}
          <div className="lg:col-span-3 space-y-6">
            {/* Next Action Panel */}
            <Card className="shadow-sm border-secondary/30 bg-secondary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-secondary" />
                  Következő teendő
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground">
                  Töltse fel az aláírt adásvételi szerződést.
                </p>
                <Button size="sm" className="mt-4 gap-2">
                  <Upload className="h-4 w-4" />
                  Dokumentum feltöltése
                </Button>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">Dokumentumok</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Table header */}
                  <div className="grid grid-cols-12 gap-2 text-xs text-muted-foreground font-medium px-3 pb-1">
                    <div className="col-span-4">Típus</div>
                    <div className="col-span-4">Fájlnév</div>
                    <div className="col-span-2">Státusz</div>
                    <div className="col-span-2 text-right">Művelet</div>
                  </div>

                  {documents.map((doc, i) => {
                    const status = docStatusMap[doc.status];
                    return (
                      <div
                        key={i}
                        className="grid grid-cols-12 gap-2 items-center px-3 py-3 rounded-xl border border-border hover:bg-muted/30 transition-colors"
                      >
                        <div className="col-span-4">
                          <p className="text-sm font-medium text-foreground">{doc.type}</p>
                        </div>
                        <div className="col-span-4">
                          <p className="text-sm text-muted-foreground truncate">{doc.filename}</p>
                        </div>
                        <div className="col-span-2">
                          <Badge className={cn("text-[10px] px-2 py-0.5", status.className)}>
                            {status.label}
                          </Badge>
                        </div>
                        <div className="col-span-2 flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
