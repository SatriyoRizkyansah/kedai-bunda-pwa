import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { BahanBaku } from "@/lib/types";
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    AlertCircle,
    Package,
} from "lucide-react";

export function BahanBakuPage() {
    const [bahanBaku, setBahanBaku] = useState<BahanBaku[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchBahanBaku();
    }, []);

    const fetchBahanBaku = async () => {
        try {
            const response = await api.get("/bahan-baku");
            setBahanBaku(response.data.data || []);
        } catch (error) {
            console.error("Error fetching bahan baku:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBahanBaku = bahanBaku.filter((item) =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: number) => {
        if (!confirm("Yakin ingin menghapus bahan baku ini?")) return;

        try {
            await api.delete(`/bahan-baku/${id}`);
            fetchBahanBaku();
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Gagal menghapus bahan baku");
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground tracking-tight">
                            Bahan Baku
                        </h2>
                        <p className="text-muted-foreground mt-2">
                            Kelola stok bahan baku untuk menu
                        </p>
                    </div>
                    <Button
                        className="gap-2"
                        style={{
                            boxShadow: "var(--shadow-md)",
                        }}
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Bahan Baku
                    </Button>
                </div>

                {/* Search */}
                <Card
                    style={{
                        boxShadow: "var(--shadow-sm)",
                        borderRadius: "var(--radius)",
                    }}
                >
                    <CardContent className="p-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Cari bahan baku..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                                style={{
                                    borderRadius: "calc(var(--radius) - 2px)",
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card
                    style={{
                        boxShadow: "var(--shadow-md)",
                        borderRadius: "var(--radius)",
                    }}
                >
                    <CardHeader className="border-b border-border">
                        <CardTitle className="text-foreground">
                            Daftar Bahan Baku
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <p className="text-center py-12 text-muted-foreground">
                                Memuat data...
                            </p>
                        ) : filteredBahanBaku.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">
                                    {searchTerm
                                        ? "Tidak ada hasil pencarian"
                                        : "Belum ada data bahan baku"}
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Bahan</TableHead>
                                        <TableHead>Satuan</TableHead>
                                        <TableHead className="text-right">
                                            Stok
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Stok Min
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Harga/Satuan
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Status
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBahanBaku.map((item) => {
                                        const isLowStock =
                                            item.stok <= item.stok_minimum;
                                        return (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium text-foreground">
                                                    {item.nama}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {item.satuan}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <span
                                                        className={`font-semibold ${
                                                            isLowStock
                                                                ? "text-destructive"
                                                                : "text-foreground"
                                                        }`}
                                                    >
                                                        {item.stok}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right text-muted-foreground">
                                                    {item.stok_minimum}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    Rp{" "}
                                                    {item.harga_satuan.toLocaleString(
                                                        "id-ID"
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {isLowStock ? (
                                                        <Badge
                                                            variant="destructive"
                                                            className="gap-1"
                                                            style={{
                                                                borderRadius:
                                                                    "calc(var(--radius) - 2px)",
                                                            }}
                                                        >
                                                            <AlertCircle className="h-3 w-3" />
                                                            Menipis
                                                        </Badge>
                                                    ) : (
                                                        <Badge
                                                            variant="success"
                                                            style={{
                                                                borderRadius:
                                                                    "calc(var(--radius) - 2px)",
                                                            }}
                                                        >
                                                            Aman
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex justify-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    item.id
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
