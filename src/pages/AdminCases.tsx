import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, X } from "lucide-react";

const statusOptions = [
  "Beküldve",
  "Ellenőrzés alatt",
  "Sárga ellenőrzés",
  "Elutasítva",
  "Jóváhagyva",
  "Szerződés készül",
  "Fizetésre vár",
  "Lezárva",
];

const minositeOptions = ["Zöld", "Sárga", "Piros"];

const resortOptions = [
  "Marriott Vacation Club",
  "Hilton Grand Vacations",
  "Wyndham Destinations",
  "Hyatt Residence Club",
  "Club Dobogómajor",
];

const mockCases = [
  { id: "TS-10234", seller: "Kovács János", resort: "Marriott Vacation Club", week: "32", status: "Ellenőrzés alatt", minosite: "Zöld", date: "2026-02-28" },
  { id: "TS-10233", seller: "Szabó Mária", resort: "Hilton Grand Vacations", week: "14", status: "Beküldve", minosite: "Zöld", date: "2026-02-27" },
  { id: "TS-10232", seller: "Nagy Richárd", resort: "Wyndham Destinations", week: "48", status: "Jóváhagyva", minosite: "Zöld", date: "2026-02-25" },
  { id: "TS-10231", seller: "Tóth Katalin", resort: "Hyatt Residence Club", week: "8", status: "Sárga ellenőrzés", minosite: "Sárga", date: "2026-02-24" },
  { id: "TS-10230", seller: "Kiss András", resort: "Club Dobogómajor", week: "22", status: "Elutasítva", minosite: "Piros", date: "2026-02-23" },
  { id: "TS-10229", seller: "Varga Éva", resort: "Marriott Vacation Club", week: "51", status: "Szerződés készül", minosite: "Zöld", date: "2026-02-22" },
  { id: "TS-10228", seller: "Horváth Péter", resort: "Hilton Grand Vacations", week: "5", status: "Fizetésre vár", minosite: "Zöld", date: "2026-02-20" },
  { id: "TS-10227", seller: "Molnár Anna", resort: "Wyndham Destinations", week: "36", status: "Lezárva", minosite: "Zöld", date: "2026-02-18" },
  { id: "TS-10226", seller: "Balogh Ferenc", resort: "Club Dobogómajor", week: "12", status: "Sárga ellenőrzés", minosite: "Sárga", date: "2026-02-17" },
  { id: "TS-10225", seller: "Lakatos Zsuzsa", resort: "Hyatt Residence Club", week: "29", status: "Beküldve", minosite: "Zöld", date: "2026-02-15" },
];

function getStatusBadgeClasses(status: string) {
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

function getMinositeBadgeClasses(m: string) {
  switch (m) {
    case "Zöld": return "bg-success/10 text-success";
    case "Sárga": return "bg-warning/10 text-warning";
    case "Piros": return "bg-destructive/10 text-destructive";
    default: return "bg-muted text-muted-foreground";
  }
}

export default function AdminCases() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [minositeFilter, setMinositeFilter] = useState<string>("all");
  const [resortFilter, setResortFilter] = useState<string>("all");

  const filtered = mockCases.filter((c) => {
    if (search && !c.id.toLowerCase().includes(search.toLowerCase()) && !c.seller.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (minositeFilter !== "all" && c.minosite !== minositeFilter) return false;
    if (resortFilter !== "all" && c.resort !== resortFilter) return false;
    return true;
  });

  const hasFilters = search || statusFilter !== "all" || minositeFilter !== "all" || resortFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setMinositeFilter("all");
    setResortFilter("all");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ügyek kezelése</h1>
          <p className="text-muted-foreground">Az összes beérkezett ügy áttekintése és kezelése.</p>
        </div>

        {/* Filters */}
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Keresés ügy számára vagy névre..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Státusz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Összes státusz</SelectItem>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={minositeFilter} onValueChange={setMinositeFilter}>
                <SelectTrigger className="w-full lg:w-44">
                  <SelectValue placeholder="Minősítés" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Összes minősítés</SelectItem>
                  {minositeOptions.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={resortFilter} onValueChange={setResortFilter}>
                <SelectTrigger className="w-full lg:w-52">
                  <SelectValue placeholder="Üdülőhely" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Összes üdülőhely</SelectItem>
                  {resortOptions.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasFilters && (
                <Button variant="ghost" size="icon" onClick={clearFilters} className="shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Ügyek listája</span>
              <span className="text-sm font-normal text-muted-foreground">{filtered.length} ügy</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ügy száma</TableHead>
                  <TableHead>Eladó neve</TableHead>
                  <TableHead>Üdülőhely</TableHead>
                  <TableHead className="text-center">Hét</TableHead>
                  <TableHead>Státusz</TableHead>
                  <TableHead>Minősítés</TableHead>
                  <TableHead>Beküldés</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow
                    key={c.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/admin/case/${c.id}`)}
                  >
                    <TableCell className="font-medium text-primary">{c.id}</TableCell>
                    <TableCell>{c.seller}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{c.resort}</TableCell>
                    <TableCell className="text-center">{c.week}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadgeClasses(c.status)}>{c.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getMinositeBadgeClasses(c.minosite)}>{c.minosite}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{c.date}</TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                      Nincs találat a megadott szűrőkkel.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
