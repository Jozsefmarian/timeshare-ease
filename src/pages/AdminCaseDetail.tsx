import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft, Download, Eye, FileText, User, MapPin, Calendar,
  CheckCircle2, AlertTriangle, XCircle, MessageSquare, RotateCcw,
  ShieldCheck, ShieldAlert, ShieldX,
} from "lucide-react";
import { useState } from "react";

const mockCase = {
  id: "TS-10234",
  status: "Ellenőrzés alatt",
  minosite: "Zöld",
  seller: {
    name: "Kovács János",
    address: "1052 Budapest, Váci utca 12.",
    email: "kovacs.janos@email.hu",
    phone: "+36 30 123 4567",
  },
  resort: {
    name: "Marriott Vacation Club",
    week: "32",
    apartmentType: "2 hálószobás deluxe",
    season: "Főszezon",
    startDate: "2015-06-01",
    endDate: "2045-06-01",
    hasShare: true,
    shareCount: 1,
  },
  documents: [
    { name: "Személyi igazolvány", file: "szemelyi_kovacs.pdf", status: "Elfogadva" },
    { name: "Tulajdoni lap", file: "tulajdoni_lap_32het.pdf", status: "Ellenőrzés alatt" },
    { name: "Üdülési jog szerződés", file: "udulesi_szerzodes.pdf", status: "Feltöltve" },
    { name: "Részvény igazolás", file: "reszveny_igazolas.pdf", status: "Probléma" },
  ],
  verification: {
    fieldMatch: "8/10 mező egyezik",
    keywords: "Nem találtunk korlátozó kulcsszavakat",
    notes: "A tulajdoni lapon szereplő név eltér a személyi igazolványon lévőtől. Egyeztetés szükséges.",
  },
};

function getStatusClasses(status: string) {
  switch (status) {
    case "Beküldve": return "bg-muted text-muted-foreground";
    case "Ellenőrzés alatt": return "bg-primary/10 text-primary";
    case "Sárga ellenőrzés": return "bg-warning/10 text-warning";
    case "Elutasítva": return "bg-destructive/10 text-destructive";
    case "Jóváhagyva": return "bg-success/10 text-success";
    case "Szerződés készül": return "bg-primary/10 text-primary";
    case "Fizetésre vár": return "bg-warning/10 text-warning";
    case "Lezárva": return "bg-muted text-muted-foreground";
    default: return "bg-muted text-muted-foreground";
  }
}

function getMinositeClasses(m: string) {
  switch (m) {
    case "Zöld": return "bg-success/10 text-success";
    case "Sárga": return "bg-warning/10 text-warning";
    case "Piros": return "bg-destructive/10 text-destructive";
    default: return "bg-muted text-muted-foreground";
  }
}

function getDocStatusClasses(s: string) {
  switch (s) {
    case "Feltöltve": return "bg-muted text-muted-foreground";
    case "Ellenőrzés alatt": return "bg-primary/10 text-primary";
    case "Elfogadva": return "bg-success/10 text-success";
    case "Probléma": return "bg-destructive/10 text-destructive";
    default: return "bg-muted text-muted-foreground";
  }
}

export default function AdminCaseDetail() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const c = mockCase;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Back + Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/cases")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground">{caseId || c.id}</h1>
              <Badge variant="outline" className={getStatusClasses(c.status)}>{c.status}</Badge>
              <Badge variant="outline" className={getMinositeClasses(c.minosite)}>{c.minosite}</Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-0.5">
              {c.seller.name} · {c.resort.name} · {c.resort.week}. hét
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Eladói adatok */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Eladói adatok
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <InfoRow label="Teljes név" value={c.seller.name} />
                  <InfoRow label="Lakcím" value={c.seller.address} />
                  <InfoRow label="Email" value={c.seller.email} />
                  <InfoRow label="Telefonszám" value={c.seller.phone} />
                </div>
              </CardContent>
            </Card>

            {/* Üdülési jog adatai */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Üdülési jog adatai
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <InfoRow label="Üdülőhely" value={c.resort.name} />
                  <InfoRow label="Hét száma" value={`${c.resort.week}. hét`} />
                  <InfoRow label="Apartman típus" value={c.resort.apartmentType} />
                  <InfoRow label="Szezon" value={c.resort.season} />
                  <InfoRow label="Jogosultság kezdete" value={c.resort.startDate} />
                  <InfoRow label="Jogosultság vége" value={c.resort.endDate} />
                  <InfoRow label="Kapcsolódik részvény" value={c.resort.hasShare ? "Igen" : "Nem"} />
                  <InfoRow label="Részvény darabszám" value={String(c.resort.shareCount)} />
                </div>
              </CardContent>
            </Card>

            {/* Dokumentumok */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Dokumentumok
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {c.documents.map((doc) => (
                    <div key={doc.file} className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{doc.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{doc.file}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Badge variant="outline" className={getDocStatusClasses(doc.status)}>{doc.status}</Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ellenőrzési eredmény */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Ellenőrzési eredmény
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Mezőegyezés</p>
                      <p className="text-sm text-muted-foreground">{c.verification.fieldMatch}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Korlátozó kulcsszavak vizsgálata</p>
                      <p className="text-sm text-muted-foreground">{c.verification.keywords}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/5 border border-warning/20">
                    <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Megjegyzések</p>
                      <p className="text-sm text-muted-foreground">{c.verification.notes}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - 1/3 */}
          <div className="space-y-6">
            {/* Admin műveletek */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Admin műveletek</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start gap-2 bg-success hover:bg-success/90 text-success-foreground">
                  <ShieldCheck className="h-4 w-4" />
                  Zöldre állítás
                </Button>
                <Button className="w-full justify-start gap-2 bg-warning hover:bg-warning/90 text-warning-foreground">
                  <ShieldAlert className="h-4 w-4" />
                  Sárgára állítás
                </Button>
                <Button className="w-full justify-start gap-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                  <ShieldX className="h-4 w-4" />
                  Pirosra állítás
                </Button>

                <Separator />

                <Button variant="outline" className="w-full justify-start gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Javítás kérése
                </Button>
              </CardContent>
            </Card>

            {/* Megjegyzés */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Megjegyzés hozzáadása
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder="Írja be a megjegyzést..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                />
                <Button className="w-full" disabled={!comment.trim()}>
                  Megjegyzés mentése
                </Button>
              </CardContent>
            </Card>

            {/* Gyors infó */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Időpontok
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <InfoRow label="Beküldés" value="2026-02-28" />
                  <InfoRow label="Utolsó módosítás" value="2026-03-04" />
                  <InfoRow label="Ellenőrzés kezdete" value="2026-03-01" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
    </div>
  );
}
