import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

i18n.translations = {
  en: {
    home: "Home",
    welcome: "Welcome",
    home_title: "Judge the Book by Its Cover",
    home_subtitle: "Upload a book cover and get a summary in seconds!",
    add_cover: "Add Book Cover",
    cover_desc: "The book cover you upload should be clear and fully visible.",
    upload_gallery: "Upload from Gallery",
    take_photo: "Take Photo",
    ai_analysis: "AI Analysis",
    add_to_library: "Add to Library",
    library: "Library",
    no_books: "You haven't added any books yet.",
    details: "Details",
    favorites: "Favorites",
    no_favorites: "No favorite books yet.",
    settings: "Settings",
    notifications: "Notifications",
    about: "About",
    logout: "Logout",
    login: "Login",
    register: "Register",
    email: "Email",
    password: "Password",
    // ... diğer metinler
  },
  tr: {
    home: "Ana Sayfa",
    welcome: "Hoş geldin",
    home_title: "Bu Sefer Kitabı Kapağına Göre Yargıla",
    home_subtitle: "Kitap kapağını yükle, saniyeler içinde kısa bir özet al!",
    add_cover: "Kitap kapağı ekle",
    cover_desc: "Yükleyeceğiniz kitap kapağı net ve tam görünecek şekilde olmalı.",
    upload_gallery: "Galeriden Yükle",
    take_photo: "Fotoğraf Çek",
    ai_analysis: "AI Analiz",
    add_to_library: "Kütüphaneye Ekle",
    library: "Kütüphane",
    no_books: "Henüz hiç kitap eklemediniz.",
    details: "Detay",
    favorites: "Favoriler",
    no_favorites: "Henüz hiç favori kitap yok.",
    settings: "Ayarlar",
    notifications: "Bildirimler",
    about: "Hakkında",
    logout: "Çıkış Yap",
    login: "Giriş Yap",
    register: "Kayıt Ol",
    email: "E-posta",
    password: "Şifre",
    // ... diğer metinler
  }
};

i18n.locale = 'en'; // Varsayılan dil İngilizce
// i18n.locale = Localization.locale; // Otomatik algılama isterseniz bu satırı açabilirsiniz

i18n.fallbacks = true;

export default i18n; 