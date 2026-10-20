/**
 * Bougenville Swimming Club - Interactive Script
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.toggle('hidden');
            if (isHidden) {
                menuIcon.classList.remove('fa-xmark');
                menuIcon.classList.add('fa-bars');
            } else {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-xmark');
            }
        });
        // Close mobile menu on clicking any navigation link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuIcon.classList.remove('fa-xmark');
                menuIcon.classList.add('fa-bars');
            });
        });
    }
    // 2. FAQ Accordion Functionality
    const faqButtons = document.querySelectorAll('.faq-btn');
    faqButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('i');
            const isOpen = !content.classList.contains('hidden');
            // Close all other FAQs
            document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
            document.querySelectorAll('.faq-btn i').forEach(ic => {
                ic.style.transform = 'rotate(0deg)';
            });
            // Toggle current FAQ
            if (!isOpen) {
                content.classList.remove('hidden');
                if (icon) icon.style.transform = 'rotate(180deg)';
            }
        });
    });
    // 3. Navbar Shadow on Scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('shadow-md');
        } else {
            navbar.classList.remove('shadow-md');
        }
    });
});
/**
 * Helper to select program and scroll to registration form
 * @param {string} programName 
 */
function pilihProgram(programName) {
    const programSelect = document.getElementById('programPilihan');
    const formSection = document.getElementById('daftar');
    if (programSelect) {
        programSelect.value = programName;
    }
    if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth' });
    }
}
/**
 * Helper to select package and scroll to registration form
 * @param {string} paketName 
 */
function pilihPaket(paketName) {
    const catatanInput = document.getElementById('catatan');
    const formSection = document.getElementById('daftar');
    if (catatanInput) {
        const currentVal = catatanInput.value ? catatanInput.value + ' | ' : '';
        catatanInput.value = `${currentVal}Tertarik dengan ${paketName}`;
    }
     if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth' });
    }
}
/**
 * WhatsApp Registration Link Generator
 * Reads form data and redirects to WhatsApp Web/App
 * @param {Event} e 
 */
function kirimWhatsApp(e) {
    e.preventDefault();
    const nama = document.getElementById('nama').value.trim();
    const usia = document.getElementById('usia').value.trim();
    const program = document.getElementById('programPilihan').value;
    const level = document.getElementById('level').value;
    const preferensiHari = document.getElementById('preferensiHari').value.trim();
    const catatan = document.getElementById('catatan').value.trim();
        // Nomor WhatsApp Admin Bougenville Swimming Club (Ganti dengan nomor WhatsApp sebenarnya, misal 62812xxxx)
    const adminWhatsAppNumber = "628973194359";
    // Format Pesan WhatsApp Terstruktur
    const pesan = 
`*PENDAFTARAN / KONSULTASI LES RENANG*
*BOUGENVILLE SWIMMING CLUB*
----------------------------------------
👤 *Nama Calon Siswa:* ${nama}
🎂 *Usia:* ${usia} Tahun
🏊 *Pilihan Program:* ${program}
🌊 *Pengalaman Renang:* ${level}
📅 *Preferensi Hari/Waktu:* ${preferensiHari || '-'}
📝 *Catatan Khusus:* ${catatan || '-'}
----------------------------------------
Halo Admin Bougenville, saya ingin berkonsultasi mengenai jadwal dan pendaftaran kelas renang di atas. Terima kasih!`;
    // Buat URL WhatsApp
    const waUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(pesan)}`;
    // Buka WhatsApp di tab baru
    window.open(waUrl, '_blank');
}