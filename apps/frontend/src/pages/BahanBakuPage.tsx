import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { BahanBaku } from "@/lib/types";
import { Plus, Pencil, Trash2, Search, AlertCircle, Package, PackagePlus, History } from "lucide-react";

export function BahanBakuPage() {
  const [bahanBaku, setBahanBaku] = useState<BahanBaku[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BahanBaku | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    satuan_dasar: "",
    stok_tersedia: "",
    harga_per_satuan: "",
    keterangan: "",
    aktif: true,
  });

  // State untuk tambah stok
  const [stokDialogOpen, setStokDialogOpen] = useState(false);
  const [stokItem, setStokItem] = useState<BahanBaku | null>(null);
  const [stokFormData, setStokFormData] = useState({
    jumlah: "",
    keterangan: "",
  });

  // State untuk histori stok
  const [historiDialogOpen, setHistoriDialogOpen] = useState(false);
  const [historiItem, setHistoriItem] = useState<BahanBaku | null>(null);
  const [stokLogs, setStokLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // State untuk confirm delete
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTargetId, setConfirmTargetId] = useState<number | null>(null);

  useEffect(() => {
    fetchBahanBaku();
  }, []);

  const fetchBahanBaku = async () => {
    setLoading(true);
    try {
      const response = await api.get("/bahan-baku");
      console.log("Bahan Baku Response:", response.data);
      setBahanBaku(response.data.data || []);
    } catch (error) {
      console.error("Error fetching bahan baku:", error);
      alert("Gagal memuat data bahan baku");
    } finally {
      setLoading(false);
    }
  };

  const filteredBahanBaku = bahanBaku.filter((item) => item.nama.toLowerCase().includes(searchTerm.toLowerCase()));

  const isLowStock = (item: BahanBaku) => {
    // Since we don't have stok_minimum in backend, use a threshold
    return Number(item.stok_tersedia || 0) < 10;
  };

  const handleOpenDialog = (item?: BahanBaku) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        nama: item.nama,
        satuan_dasar: item.satuan_dasar,
        stok_tersedia: item.stok_tersedia.toString(),
        harga_per_satuan: item.harga_per_satuan.toString(),
        keterangan: item.keterangan || "",
        aktif: item.aktif,
      });
    } else {
      setEditingItem(null);
      setFormData({
        nama: "",
        satuan_dasar: "",
        stok_tersedia: "0",
        harga_per_satuan: "0",
        keterangan: "",
        aktif: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingItem(null);
    setFormData({
      nama: "",
      satuan_dasar: "",
      stok_tersedia: "0",
      harga_per_satuan: "0",
      keterangan: "",
      aktif: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      nama: formData.nama,
      satuan_dasar: formData.satuan_dasar,
      stok_tersedia: parseFloat(formData.stok_tersedia),
      harga_per_satuan: parseFloat(formData.harga_per_satuan),
      keterangan: formData.keterangan,
      aktif: formData.aktif,
    };

    try {
      if (editingItem) {
        await api.put(`/bahan-baku/${editingItem.id}`, payload);
        alert("Bahan baku berhasil diupdate");
      } else {
        await api.post("/bahan-baku", payload);
        alert("Bahan baku berhasil ditambahkan");
      }
      handleCloseDialog();
      fetchBahanBaku();
    } catch (error: any) {
      console.error("Error saving:", error);
      alert(error.response?.data?.pesan || "Gagal menyimpan data");
    }
  };

  const handleDelete = async (id: number) => {
    setConfirmTargetId(id);
    setConfirmOpen(true);
  };

  const performDelete = async () => {
    if (!confirmTargetId) return;
    try {
      await api.delete(`/bahan-baku/${confirmTargetId}`);
      setConfirmOpen(false);
      setConfirmTargetId(null);
      fetchBahanBaku();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  // Handler untuk tambah stok
  const handleOpenStokDialog = (item: BahanBaku) => {
    setStokItem(item);
    setStokFormData({ jumlah: "", keterangan: "" });
    setStokDialogOpen(true);
  };

  const handleTambahStok = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stokItem) return;

    try {
      await api.post(`/bahan-baku/${stokItem.id}/tambah-stok`, {
        jumlah: parseFloat(stokFormData.jumlah),
        keterangan: stokFormData.keterangan || `Penambahan stok ${stokItem.nama}`,
      });
      setStokDialogOpen(false);
      setStokItem(null);
      fetchBahanBaku();
    } catch (error: any) {
      console.error("Error tambah stok:", error);
    }
  };

  // Handler untuk histori stok
  const handleOpenHistori = async (item: BahanBaku) => {
    setHistoriItem(item);
    setLoadingLogs(true);
    setHistoriDialogOpen(true);

    try {
      const response = await api.get(`/bahan-baku/${item.id}/stok-log`);
      setStokLogs(response.data.data?.data || []);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setStokLogs([]);
    } finally {
      setLoadingLogs(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground tracking-tight" style={{ fontFamily: "var(--font-sans)" }}>
              Bahan Baku
            </h2>
            <p className="text-muted-foreground mt-2" style={{ fontFamily: "var(--font-sans)" }}>
              Kelola stok bahan baku untuk menu
            </p>
          </div>
          <Button
            onClick={() => handleOpenDialog()}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            style={{
              boxShadow: "var(--shadow-md)",
              borderRadius: "var(--radius)",
              fontFamily: "var(--font-sans)",
            }}
          >
            <Plus className="h-4 w-4" />
            Tambah Bahan Baku
          </Button>
        </div>

        {/* Search */}
        <Card
          className="bg-card border-border"
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
                className="pl-10 bg-background border-input text-foreground"
                style={{
                  borderRadius: "calc(var(--radius) - 2px)",
                  fontFamily: "var(--font-sans)",
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card
          className="bg-card border-border"
          style={{
            boxShadow: "var(--shadow-md)",
            borderRadius: "var(--radius)",
          }}
        >
          <CardHeader className="border-b border-border">
            <CardTitle className="text-foreground" style={{ fontFamily: "var(--font-sans)" }}>
              Daftar Bahan Baku
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <LoadingScreen message="Memuat data bahan baku..." size="md" />
            ) : filteredBahanBaku.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground" style={{ fontFamily: "var(--font-sans)" }}>
                  {searchTerm ? "Tidak ada hasil pencarian" : "Belum ada data bahan baku"}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Bahan</TableHead>
                    <TableHead>Satuan</TableHead>
                    <TableHead className="text-right">Stok Tersedia</TableHead>
                    <TableHead className="text-right">Keterangan</TableHead>
                    <TableHead className="text-right">Harga/Satuan</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBahanBaku.map((item) => {
                    const lowStock = isLowStock(item);
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium text-foreground">{item.nama}</TableCell>
                        <TableCell className="text-muted-foreground">{item.satuan_dasar}</TableCell>
                        <TableCell className="text-right">
                          <span className={`font-semibold ${lowStock ? "text-destructive" : "text-foreground"}`}>{Number(item.stok_tersedia || 0).toFixed(2)}</span>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">{item.keterangan || "-"}</TableCell>
                        <TableCell className="text-right font-medium">Rp {Number(item.harga_per_satuan || 0).toLocaleString("id-ID")}</TableCell>
                        <TableCell className="text-center">
                          {lowStock ? (
                            <Badge
                              variant="destructive"
                              className="gap-1"
                              style={{
                                borderRadius: "calc(var(--radius) - 2px)",
                                fontFamily: "var(--font-sans)",
                                boxShadow: "var(--shadow-sm)",
                              }}
                            >
                              <AlertCircle className="h-3 w-3" />
                              Menipis
                            </Badge>
                          ) : (
                            <Badge
                              variant="success"
                              className="bg-green-500 text-white hover:bg-green-600"
                              style={{
                                borderRadius: "calc(var(--radius) - 2px)",
                                fontFamily: "var(--font-sans)",
                                boxShadow: "var(--shadow-sm)",
                              }}
                            >
                              Aman
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-1">
                            <Button
                              onClick={() => handleOpenStokDialog(item)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-green-500/10 hover:text-green-600"
                              title="Tambah Stok"
                              style={{
                                borderRadius: "calc(var(--radius) - 4px)",
                              }}
                            >
                              <PackagePlus className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleOpenHistori(item)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-blue-500/10 hover:text-blue-600"
                              title="Riwayat Stok"
                              style={{
                                borderRadius: "calc(var(--radius) - 4px)",
                              }}
                            >
                              <History className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleOpenDialog(item)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                              title="Edit"
                              style={{
                                borderRadius: "calc(var(--radius) - 4px)",
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                              title="Hapus"
                              style={{
                                borderRadius: "calc(var(--radius) - 4px)",
                              }}
                              onClick={() => handleDelete(item.id)}
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

        {/* Dialog Form */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Bahan Baku" : "Tambah Bahan Baku"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="nama" className="text-sm font-medium">
                    Nama Bahan <span className="text-destructive">*</span>
                  </label>
                  <Input id="nama" value={formData.nama} onChange={(e) => setFormData({ ...formData, nama: e.target.value })} placeholder="Contoh: Ayam Potong" required />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="satuan_dasar" className="text-sm font-medium">
                    Satuan Dasar <span className="text-destructive">*</span>
                  </label>
                  <Input id="satuan_dasar" value={formData.satuan_dasar} onChange={(e) => setFormData({ ...formData, satuan_dasar: e.target.value })} placeholder="Contoh: ekor, kg, liter" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="stok_tersedia" className="text-sm font-medium">
                      Stok Tersedia <span className="text-destructive">*</span>
                    </label>
                    <Input id="stok_tersedia" type="number" step="0.01" min="0" value={formData.stok_tersedia} onChange={(e) => setFormData({ ...formData, stok_tersedia: e.target.value })} required />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="harga_per_satuan" className="text-sm font-medium">
                      Harga/Satuan <span className="text-destructive">*</span>
                    </label>
                    <Input id="harga_per_satuan" type="number" step="0.01" min="0" value={formData.harga_per_satuan} onChange={(e) => setFormData({ ...formData, harga_per_satuan: e.target.value })} required />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="keterangan" className="text-sm font-medium">
                    Keterangan
                  </label>
                  <Input id="keterangan" value={formData.keterangan} onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })} placeholder="Keterangan tambahan (opsional)" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Batal
                </Button>
                <Button type="submit">{editingItem ? "Update" : "Simpan"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dialog Tambah Stok */}
        <Dialog open={stokDialogOpen} onOpenChange={setStokDialogOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Tambah Stok</DialogTitle>
              <DialogDescription>
                {stokItem?.nama} - Stok saat ini: {Number(stokItem?.stok_tersedia || 0).toFixed(2)} {stokItem?.satuan_dasar}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleTambahStok}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="jumlah_stok" className="text-sm font-medium">
                    Jumlah Tambah <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="jumlah_stok"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={stokFormData.jumlah}
                    onChange={(e) => setStokFormData({ ...stokFormData, jumlah: e.target.value })}
                    placeholder={`Jumlah dalam ${stokItem?.satuan_dasar || "satuan"}`}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="keterangan_stok" className="text-sm font-medium">
                    Keterangan
                  </label>
                  <Input id="keterangan_stok" value={stokFormData.keterangan} onChange={(e) => setStokFormData({ ...stokFormData, keterangan: e.target.value })} placeholder="Contoh: Pembelian dari supplier" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setStokDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  <PackagePlus className="h-4 w-4 mr-2" />
                  Tambah Stok
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Dialog Histori Stok */}
        <Dialog open={historiDialogOpen} onOpenChange={setHistoriDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Riwayat Stok - {historiItem?.nama}</DialogTitle>
            </DialogHeader>
            <div className="max-h-[400px] overflow-y-auto">
              {loadingLogs ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Memuat riwayat...</p>
                </div>
              ) : stokLogs.length === 0 ? (
                <div className="text-center py-8">
                  <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Belum ada riwayat perubahan stok</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Tipe</TableHead>
                      <TableHead className="text-right">Jumlah</TableHead>
                      <TableHead className="text-right">Stok Akhir</TableHead>
                      <TableHead>Keterangan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stokLogs.map((log: any) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm">
                          {new Date(log.created_at).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge variant={log.tipe === "masuk" ? "success" : "destructive"} className={log.tipe === "masuk" ? "bg-green-500" : ""}>
                            {log.tipe === "masuk" ? "+" : "-"} {log.tipe}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {log.tipe === "masuk" ? "+" : "-"}
                          {Number(log.jumlah).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">{Number(log.stok_sesudah).toFixed(2)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{log.keterangan || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setHistoriDialogOpen(false)}>
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog Konfirmasi Hapus */}
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Konfirmasi Hapus</DialogTitle>
              <DialogDescription>Apakah Anda yakin ingin menghapus bahan baku ini? Tindakan ini tidak dapat dibatalkan.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={performDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
