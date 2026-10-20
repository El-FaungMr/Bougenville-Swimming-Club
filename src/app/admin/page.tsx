"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { RegistrationRecord, RegistrationStatus } from "@/lib/types";
import { REGISTRATION_STATUSES, PROGRAMS, CLUB_INFO } from "@/lib/constants";
import { buildAdminContactParentWhatsAppUrl } from "@/lib/whatsapp";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  CalendarCheck,
  AlertCircle,
  XCircle,
  MessageSquare,
  Trash2,
  Edit,
  LogOut,
  RefreshCw,
  Eye,
  Shield,
  Phone,
  ChevronRight,
  Save,
  X,
  Loader2,
  PlusCircle,
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState<string>("");

  const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Modal Detail & Edit
  const [selectedRecord, setSelectedRecord] = useState<RegistrationRecord | null>(null);
  const [editStatus, setEditStatus] = useState<RegistrationStatus>("Baru");
  const [editAgreedSchedule, setEditAgreedSchedule] = useState("");
  const [editAdminNotes, setEditAdminNotes] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Modal Konfirmasi Hapus
  const [deleteConfirmRecord, setDeleteConfirmRecord] = useState<RegistrationRecord | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 1. Periksa sesi login
  useEffect(() => {
    if (isFirebaseConfigured() && auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUser(user);
          setAdminEmail(user.email || "");
          setAuthLoading(false);
        } else {
          // Cek fallback localStorage dev
          const localEmail = typeof window !== "undefined" ? localStorage.getItem("admin_auth_email") : null;
          if (localEmail) {
            setAdminEmail(localEmail);
            setAuthLoading(false);
          } else {
            router.push("/admin/login");
          }
        }
      });
      return () => unsubscribe();
    } else {
      // Offline / dev mode fallback
      const localEmail = typeof window !== "undefined" ? localStorage.getItem("admin_auth_email") : null;
      if (localEmail) {
        setAdminEmail(localEmail);
        setAuthLoading(false);
      } else {
        router.push("/admin/login");
      }
    }
  }, [router]);

  // 2. Ambil data pendaftaran dari backend
  const fetchRegistrations = async () => {
    setDataLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/registrations", {
        headers: {
          "x-admin-email": adminEmail,
        },
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal memuat data pendaftaran.");
      }

      setRegistrations(json.data || []);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setErrorMessage(err.message || "Gagal menghubungi server database.");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && adminEmail) {
      fetchRegistrations();
    }
  }, [authLoading, adminEmail]);

  // 3. Logout action
  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar dari Dashboard Admin?")) {
      if (auth) {
        await signOut(auth);
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_auth_email");
      }
      router.push("/admin/login");
    }
  };

  // 4. Modal Open handler
  const handleOpenDetail = (record: RegistrationRecord) => {
    setSelectedRecord(record);
    setEditStatus(record.status);
    setEditAgreedSchedule(record.agreedSchedule || "");
    setEditAdminNotes(record.adminNotes || "");
    setSaveSuccessNotice(false);
  };

  // 5. Simpan perubahan detail (Status, Jadwal, Catatan Internal)
  const handleSaveDetail = async () => {
    if (!selectedRecord) return;
    setSaveLoading(true);

    try {
      const res = await fetch("/api/admin/registrations", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": adminEmail,
        },
        body: JSON.stringify({
          id: selectedRecord.id,
          status: editStatus,
          agreedSchedule: editAgreedSchedule,
          adminNotes: editAdminNotes,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal memperbarui data pendaftaran.");
      }

      // Update state lokal
      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === selectedRecord.id
            ? {
                ...r,
                status: editStatus,
                agreedSchedule: editAgreedSchedule,
                adminNotes: editAdminNotes,
                updatedAt: new Date().toISOString(),
              }
            : r
        )
      );

      setSelectedRecord((prev) =>
        prev
          ? {
              ...prev,
              status: editStatus,
              agreedSchedule: editAgreedSchedule,
              adminNotes: editAdminNotes,
            }
          : null
      );

      setSaveSuccessNotice(true);
      setTimeout(() => setSaveSuccessNotice(false), 3000);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  // 6. Hapus pendaftaran
  const handleDeleteConfirm = async () => {
    if (!deleteConfirmRecord) return;
    setDeleteLoading(true);

    try {
      const res = await fetch(`/api/admin/registrations?id=${deleteConfirmRecord.id}`, {
        method: "DELETE",
        headers: {
          "x-admin-email": adminEmail,
        },
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal menghapus pendaftaran.");
      }

      setRegistrations((prev) => prev.filter((r) => r.id !== deleteConfirmRecord.id));
      if (selectedRecord?.id === deleteConfirmRecord.id) {
        setSelectedRecord(null);
      }
      setDeleteConfirmRecord(null);
    } catch (err: any) {
      alert("Gagal menghapus: " + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Statistik Jumlah Pendaftar
  const stats = useMemo(() => {
    return {
      total: registrations.length,
      baru: registrations.filter((r) => r.status === "Baru").length,
      dihubungi: registrations.filter((r) => r.status === "Dihubungi").length,
      terjadwal: registrations.filter((r) => r.status === "Terjadwal").length,
      selesai: registrations.filter((r) => r.status === "Selesai").length,
      dibatalkan: registrations.filter((r) => r.status === "Dibatalkan").length,
    };
  }, [registrations]);

  // Data Terfilter
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((item) => {
      // Search
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        item.fullName.toLowerCase().includes(query) ||
        item.parentName.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query);

      // Filter Program
      const matchProgram =
        selectedProgram === "all" || item.program === selectedProgram;

      // Filter Status
      const matchStatus =
        selectedStatus === "all" || item.status === selectedStatus;

      return matchSearch && matchProgram && matchStatus;
    });
  }, [registrations, searchQuery, selectedProgram, selectedStatus]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 text-brand-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Memeriksa autentikasi pengelola...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 pb-20">
      {/* Top Admin Bar */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Logo variant="light" size="sm" />
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-brand-800 text-cyan-300 text-xs font-bold">
                Admin Panel
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="hidden md:inline-block text-slate-400">
                Login sebagai: <strong className="text-white">{adminEmail}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Header Title & Refresh Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Dashboard Pendaftaran Atlet
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Kelola konfirmasi calon siswa, penentuan jadwal appointment, dan catatan latihan.
            </p>
          </div>

          <button
            onClick={fetchRegistrations}
            disabled={dataLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold shadow-sm transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${dataLoading ? "animate-spin" : ""}`} />
            <span>Segarkan Data</span>
          </button>
        </div>

        {/* STATISTIK CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Pendaftar</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-sm bg-blue-50/40">
            <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Baru</p>
            <p className="text-2xl font-extrabold text-blue-900 mt-1">{stats.baru}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm bg-amber-50/40">
            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider">Dihubungi</p>
            <p className="text-2xl font-extrabold text-amber-900 mt-1">{stats.dihubungi}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-purple-200 shadow-sm bg-purple-50/40">
            <p className="text-xs font-bold text-purple-700 uppercase tracking-wider">Terjadwal</p>
            <p className="text-2xl font-extrabold text-purple-900 mt-1">{stats.terjadwal}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm bg-emerald-50/40">
            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Selesai</p>
            <p className="text-2xl font-extrabold text-emerald-900 mt-1">{stats.selesai}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm bg-slate-50">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dibatalkan</p>
            <p className="text-2xl font-extrabold text-slate-700 mt-1">{stats.dibatalkan}</p>
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Input Search */}
            <div className="sm:col-span-6 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Cari nama atlet, orang tua, atau ID registrasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs sm:text-sm"
              />
            </div>

            {/* Filter Program */}
            <div className="sm:col-span-3">
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs sm:text-sm bg-white"
              >
                <option value="all">Semua Program</option>
                {PROGRAMS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Status */}
            <div className="sm:col-span-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs sm:text-sm bg-white"
              >
                <option value="all">Semua Status</option>
                {REGISTRATION_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    Status: {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>
              Menampilkan <strong>{filteredRegistrations.length}</strong> dari {registrations.length} pendaftaran
            </span>
            {(searchQuery || selectedProgram !== "all" || selectedStatus !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedProgram("all");
                  setSelectedStatus("all");
                }}
                className="text-brand-600 hover:underline font-semibold"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* ERROR NOTICE */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* TABEL / CARD LIST PENDAFTAR */}
        {dataLoading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
            <Loader2 className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Memuat data pendaftar...</p>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
            <Users className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">Belum Ada Pendaftaran yang Cocok</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery || selectedProgram !== "all" || selectedStatus !== "all"
                ? "Tidak ada pendaftaran yang sesuai dengan kriteria filter."
                : "Belum ada pendaftaran baru yang masuk dari calon atlet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="py-4 px-6">ID / Tanggal</th>
                    <th className="py-4 px-6">Nama Atlet</th>
                    <th className="py-4 px-6">Orang Tua / Kontak</th>
                    <th className="py-4 px-6">Program & Biaya</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRegistrations.map((rec) => {
                    const waParentUrl = buildAdminContactParentWhatsAppUrl(rec);

                    return (
                      <tr key={rec.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-4 px-6">
                          <span className="font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded text-[11px] border border-brand-200">
                            {rec.id}
                          </span>
                          <span className="block text-[11px] text-slate-400 mt-1">
                            {rec.createdAt ? new Date(rec.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }) : "-"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-bold text-slate-900 text-sm block">
                            {rec.fullName}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {rec.age} Tahun • Level: {rec.swimmingLevel}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-semibold text-slate-800 block">
                            {rec.parentName}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {rec.parentWhatsapp}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-semibold text-slate-900 block">
                            {rec.programTitle}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {rec.priceDisplay}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full font-bold text-[11px] ${
                              rec.status === "Baru"
                                ? "bg-blue-100 text-blue-800"
                                : rec.status === "Dihubungi"
                                ? "bg-amber-100 text-amber-800"
                                : rec.status === "Terjadwal"
                                ? "bg-purple-100 text-purple-800"
                                : rec.status === "Selesai"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {rec.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <a
                            href={waParentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 transition font-bold text-xs"
                            title="Chat WhatsApp Orang Tua"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>WA</span>
                          </a>

                          <button
                            onClick={() => handleOpenDetail(rec)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white border border-brand-200 transition font-bold text-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Detail</span>
                          </button>

                          <button
                            onClick={() => setDeleteConfirmRecord(rec)}
                            className="inline-flex items-center p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Hapus pendaftaran"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (Nyaman di HP) */}
            <div className="lg:hidden space-y-3">
              {filteredRegistrations.map((rec) => {
                const waParentUrl = buildAdminContactParentWhatsAppUrl(rec);

                return (
                  <div
                    key={rec.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono font-bold text-brand-700 text-xs bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                          {rec.id}
                        </span>
                        <h4 className="font-extrabold text-base text-slate-900 mt-1.5">
                          {rec.fullName}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {rec.age} Tahun • Level: {rec.swimmingLevel}
                        </p>
                      </div>

                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          rec.status === "Baru"
                            ? "bg-blue-100 text-blue-800"
                            : rec.status === "Dihubungi"
                            ? "bg-amber-100 text-amber-800"
                            : rec.status === "Terjadwal"
                            ? "bg-purple-100 text-purple-800"
                            : rec.status === "Selesai"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {rec.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl">
                      <p>
                        <strong>Program:</strong> {rec.programTitle} ({rec.priceDisplay})
                      </p>
                      <p>
                        <strong>Orang Tua:</strong> {rec.parentName} ({rec.parentWhatsapp})
                      </p>
                      <p>
                        <strong>Preferensi:</strong> {rec.preferredSchedule}
                      </p>
                      {rec.agreedSchedule && (
                        <p className="text-emerald-700 font-semibold">
                          <strong>Jadwal Sah:</strong> {rec.agreedSchedule}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={waParentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Chat WA</span>
                      </a>
                      <button
                        onClick={() => handleOpenDetail(rec)}
                        className="flex-1 py-2 px-3 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-brand-200"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Kelola</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirmRecord(rec)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MODAL DETAIL & MANAJEMEN PENDAFTARAN */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-auto">
            {/* Header Modal */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-200">
                  {selectedRecord.id}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                  Detail & Pengelolaan Pendaftaran
                </h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notice Sukses Simpan */}
            {saveSuccessNotice && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Perubahan berhasil disimpan!</span>
              </div>
            )}

            {/* Rincian Atlet & Orang Tua */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Informasi Atlet
                </p>
                <p className="text-sm font-bold text-slate-900">{selectedRecord.fullName}</p>
                <p className="text-slate-600">
                  Usia: <strong>{selectedRecord.age} Tahun</strong>
                  {selectedRecord.birthDate && ` (Lahir: ${selectedRecord.birthDate})`}
                </p>
                <p className="text-slate-600">
                  Level Kemampuan: <strong>{selectedRecord.swimmingLevel}</strong>
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Orang Tua / Wali
                </p>
                <p className="text-sm font-bold text-slate-900">{selectedRecord.parentName}</p>
                <p className="text-slate-600 font-mono">
                  WhatsApp: <strong>{selectedRecord.parentWhatsapp}</strong>
                </p>
                <div className="pt-1">
                  <a
                    href={buildAdminContactParentWhatsAppUrl(selectedRecord)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat Orang Tua</span>
                  </a>
                </div>
              </div>

              <div className="sm:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5">
                <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Program & Preferensi
                </p>
                <p className="text-slate-800">
                  Program: <strong>{selectedRecord.programTitle}</strong> — {selectedRecord.priceDisplay}
                </p>
                <p className="text-slate-800">
                  Preferensi Hari/Jam: <strong>{selectedRecord.preferredSchedule}</strong>
                </p>
                {selectedRecord.notes && (
                  <p className="text-slate-600 italic">
                    Catatan Tambahan Pendaftar: &ldquo;{selectedRecord.notes}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {/* Form Pengelolaan Admin */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Aksi & Catatan Pengelola
              </h4>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Ubah Status Pendaftaran:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {REGISTRATION_STATUSES.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEditStatus(st)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition ${
                        editStatus === st
                          ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jadwal yang Disepakati */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Jadwal Latihan yang Disepakati (Appointment):
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Sabtu & Minggu 08.00 - 09.00 WIB (Kolam Mitra A)"
                  value={editAgreedSchedule}
                  onChange={(e) => setEditAgreedSchedule(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs sm:text-sm"
                />
              </div>

              {/* Catatan Internal Admin */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Catatan Internal Pengelola (Hanya dilihat admin):
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Orang tua konfirmasi transfer tanggal 22, anak takut air kedalaman > 1.2m, pelatih Coach Dimas."
                  value={editAdminNotes}
                  onChange={(e) => setEditAdminNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* Footer Modal Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmRecord(selectedRecord)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Hapus Pendaftaran Ini</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={handleSaveDetail}
                  disabled={saveLoading}
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saveLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS */}
      {deleteConfirmRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Konfirmasi Hapus Data</h3>
              <p className="text-xs text-slate-600">
                Apakah Anda yakin ingin menghapus data pendaftaran atlet{" "}
                <strong>{deleteConfirmRecord.fullName}</strong> ({deleteConfirmRecord.id}) secara permanen?
              </p>
            </div>
            <p className="text-[11px] text-rose-700 bg-rose-50 p-2.5 rounded-xl text-center">
              Tindakan ini tidak dapat dibatalkan. Seluruh data registrasi dan catatan internal akan dihapus.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmRecord(null)}
                disabled={deleteLoading}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {deleteLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>Ya, Hapus Data</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
