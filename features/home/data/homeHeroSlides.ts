export type HomeHeroSlide = {
  id: string;
  badge: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  highlights: string[];
  accentLabel: string;
  accentValue: string;
  themeClassName: string;
};

export const homeHeroSlides: HomeHeroSlide[] = [
  {
    id: "hydration-deals",
    badge: "4.4",
    eyebrow: "Torriden picks",
    title: "Cap am tuoi mat cho thang 4",
    description:
      "Cham soc da mua he voi deal mall, qua tang don lon va giao nhanh trong ngay.",
    primaryCtaLabel: "Mua ngay",
    primaryCtaHref: "#catalog",
    secondaryCtaLabel: "Xem uu dai",
    secondaryCtaHref: "/checkout",
    highlights: ["Tang qua don tu 349.000D", "Giam den 40%", "Mall chinh hang"],
    accentLabel: "LIVE",
    accentValue: "0D",
    themeClassName: "themeSky"
  },
  {
    id: "phone-top-up",
    badge: "Hot",
    eyebrow: "Nap tien sieu tiet kiem",
    title: "Nap the nhanh, uu dai den 70.000D",
    description:
      "Goi khuyen mai moi ngay cho top-up, data va hoa don voi thao tac thanh toan don gian.",
    primaryCtaLabel: "Nap ngay",
    primaryCtaHref: "/checkout",
    secondaryCtaLabel: "Xem them",
    secondaryCtaHref: "#catalog",
    highlights: ["Ma giam theo nha mang", "Xu thuong moi ngay", "Hoan xu thanh toan"],
    accentLabel: "Top up",
    accentValue: "70K",
    themeClassName: "themeSunset"
  },
  {
    id: "food-night",
    badge: "Food",
    eyebrow: "Mon ngon buoi toi",
    title: "Deal an toi freeship va giam 50%",
    description:
      "Tap hop combo quan quen, voucher gio vang va uu dai cho khach hang than thiet.",
    primaryCtaLabel: "Dat mon",
    primaryCtaHref: "/checkout",
    secondaryCtaLabel: "Xem flash sale",
    secondaryCtaHref: "#catalog",
    highlights: ["Freeship toi da", "Deal combo doc quyen", "Ap dung gio vang"],
    accentLabel: "Food",
    accentValue: "50%",
    themeClassName: "themeCoral"
  }
];
