import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SellerLayout from "@/components/SellerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CheckCircle2,
  Circle,
  FileText,
  Upload,
  FileSearch,
  PenLine,
  FileCheck,
  CreditCard,
  Lock,
  SendHorizonal,
  ArrowLeft,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Bot,
  Eye,
  FileSignature,
  Banknote,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

type CaseRow = {
  id: string;
  case_number: string;
  status: string;
  status_group: string | null;
  current_step: string | null;
  priority: string | null;
  source: string | null;
  created_at: string;
  updated_at: string;
  submitted_at: string | null;
  closed_at: string | null;
};

const timelineSteps = [
  { key: "draft", label: "Piszkozat", icon: Pencil },
  { key: "submitted", label: "Beküldve", icon: SendHorizonal },
  { key: "docs_uploaded", label: "Dokumentumok feltöltve", icon: Upload },
  { key: "ai_processing", label: "AI feldolgozás", icon: Bot },
  { key: "yellow_review", label: "Manuális felülvizsgálat", icon: Eye },
  { key: "red_rejected", label: "Elutasítva", icon: ShieldAlert },
  { key: "green_approved", label: "Jóváhagyva", icon: ShieldCheck },
  { key: "contract_generated", label: "Szerződés elkészítve", icon: FileText },
  { key: "awaiting_signed_contract", label: "Aláírt szerződés feltöltése", icon: PenLine },
  { key: "signed_contract_uploaded", label: "Aláírt szerződés feltöltve", icon: FileSignature },
  { key: "service_agreement_accepted", label: "Szolgáltatási szerződés elfogadva", icon: FileCheck },
  { key: "payment_pending", label: "Fizetésre vár", icon: CreditCard },
  { key: "paid", label: "Fizetve", icon: Banknote },
  { key: "closed", label: "Lezárva", icon: Lock },
] as const;

const statusLabelMap: Record<string, string> = {
  draft: "Piszkozat",
  submitted: "Beküldve",
  docs_uploaded: "Dokumentumok feltöltve",
  ai_processing: "AI feldolgozás",
  yellow_review: "Manuális felülvizsgálat",
  red_rejected: "Elutasítva",
  green_approved: "Jóváhagyva",
  contract_generated: "Szerződés elkészítve",
  awaiting_signed_contract: "Aláírt szerződés feltöltése",
  signed_contract_uploaded: "Aláírt szerződés feltöltve",
  service_agreement_accepted: "Szolgáltatási szerződés elfogadva",
  payment_pending: "Fizetésre vár",
  paid: "Fizetve",
  closed: "Lezárva",
  cancelled: "Visszavonva",
  completed: "Befejezve",
};

function statusBadgeClass(status: string) {
  if (status === "red_rejected" || status === "cancelled") return "bg-destructive/15 text-destructive border-destructive/30";
  if (status === "closed" || status === "completed" || status === "paid") return "bg-success/15 text-success border-success/30";
  if (status === "green_approved") return "bg-success/15 text-success border-success/30";
  if (status === "yellow_review" || status === "payment_pending") return "bg-warning/15 text-warning border-warning/30";
  if (status === "draft") return "bg-muted text-muted-foreground";
  return "bg-primary/15 text-primary border-primary/30";
}

function priorityLabel(p: string | null) {
  if (!p) return "normál";
  const map: Record<string, string> = { low: "alacsony", normal: "normál", high: "magas", urgent: "sürgős" };
  return map[p] ?? p;
}

function fmtDate(d: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("hu-HU", { year: "numeric", month: "long", day: "numeric" });
}

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const [caseData, setCaseData] = useState<CaseRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      setError(null);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setError("Nincs bejelentkezve."); setLoading(false); return; }
      const { data, error: qErr } = await (supabase as any)
        .from("cases")
        .select("id, case_number, status, status_group, current_step, priority, source, created_at, updated_at, submitted_at, closed_at")
        .eq("id", id)
        .maybeSingle();
      if (qErr) { setError(qErr.message); setLoading(false); return; }
      setCaseData(data as CaseRow | null);
      setLoading(false);
    })();
  }, [id]);

  const isCancelled = caseData?.status === "cancelled";
  const currentIndex = caseData ? timelineSteps.findIndex((s) => s.key === caseData.status) : -1;

  return (
    <SellerLayout>
      <div className="space-y-6">
        <Link to="/seller" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Vissza a vezérlőpultra
        </Link>

        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-lg" />
            <div className="grid lg:grid-cols-5 gap-6">
              <Skeleton className="h-64 lg:col-span-2 rounded-lg" />
              <Skeleton className="h-64 lg:col-span-3 rounded-lg" />
            </div>
          </div>
        )}

        {!loading && error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Hiba</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!loading && !error && !caseData && (
          <Card className="shadow-sm">
            <CardContent className="p-10 text-center space-y-2">
              <FileSearch className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="text-lg font-semibold text-foreground">Az ügy nem található</p>
              <p className="text-sm text-muted-foreground">Lehet, hogy nincs hozzáférésed ehhez az ügyöz, vagy az ügy nem létezik.</p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && caseData && (
          <>
            {/* Header */}
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">Ügy száma</p>
                    <h1 className="text-2xl font-bold text-foreground">{caseData.case_number}</h1>
                  </div>
                  <Badge className={cn("text-xs font-semibold px-3 py-1", statusBadgeClass(caseData.status))}>
                    {statusLabelMap[caseData.status] ?? caseData.status}
                  </Badge>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Aktuális lépés</p>
                    <p className="font-medium text-foreground">{caseData.current_step ? (statusLabelMap[caseData.current_step] ?? caseData.current_step) : "Nincs megadva"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Prioritás</p>
                    <p className="font-medium text-foreground capitalize">{priorityLabel(caseData.priority)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Státusz csoport</p>
                    <p className="font-medium text-foreground">{caseData.status_group ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Forrás</p>
                    <p className="font-medium text-foreground">{caseData.source ?? "—"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Two-column */}
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Timeline */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Ügy állapota</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isCancelled ? (
                      <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                        <XCircle className="h-6 w-6 text-destructive shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-destructive">Visszavonva</p>
                          <p className="text-xs text-muted-foreground mt-1">Ez az ügy visszavonásra került.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        {timelineSteps.map((step, i) => {
                          const completed = currentIndex >= 0 && i < currentIndex;
                          const current = i === currentIndex;
                          const isRejected = step.key === "red_rejected" && current;
                          const Icon = step.icon;
                          const isLast = i === timelineSteps.length - 1;

                          return (
                            <div key={step.key} className="flex gap-4 relative">
                              {!isLast && (
                                <div className={cn(
                                  "absolute left-[17px] top-[36px] w-0.5 h-[calc(100%-12px)]",
                                  completed ? "bg-success" : current ? (isRejected ? "bg-destructive" : "bg-secondary") : "bg-border"
                                )} />
                              )}
                              <div className={cn(
                                "relative z-10 flex items-center justify-center h-9 w-9 rounded-full shrink-0 border-2 transition-colors",
                                completed ? "bg-success border-success text-success-foreground"
                                  : current ? (isRejected ? "bg-destructive border-destructive text-destructive-foreground" : "bg-secondary border-secondary text-secondary-foreground")
                                  : "bg-muted border-border text-muted-foreground"
                              )}>
                                {completed ? <CheckCircle2 className="h-4 w-4" /> : current ? <Icon className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                              </div>
                              <div className={cn("pb-8", isLast && "pb-0")}>
                                <p className={cn(
                                  "text-sm font-medium leading-tight",
                                  completed ? "text-success" : current ? (isRejected ? "text-destructive" : "text-foreground") : "text-muted-foreground"
                                )}>{step.label}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Details */}
              <div className="lg:col-span-3 space-y-6">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">Részletek</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Létrehozva</span>
                        <span className="font-medium text-foreground">{fmtDate(caseData.created_at)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Utoljára módosítva</span>
                        <span className="font-medium text-foreground">{fmtDate(caseData.updated_at)}</span>
                      </div>
                      {caseData.submitted_at && (
                        <>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Beküldve</span>
                            <span className="font-medium text-foreground">{fmtDate(caseData.submitted_at)}</span>
                          </div>
                        </>
                      )}
                      {caseData.closed_at && (
                        <>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Lezárva</span>
                            <span className="font-medium text-foreground">{fmtDate(caseData.closed_at)}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </SellerLayout>
  );
}
