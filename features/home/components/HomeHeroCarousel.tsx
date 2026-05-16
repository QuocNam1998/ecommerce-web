"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./HomeHeroCarousel.module.css";
import type { HomeHeroSlide } from "@/features/home/data/homeHeroSlides";

type FeatureCardLabels = {
  title: string;
  value: string;
  description: string;
};

type HomeHeroCarouselLabels = {
  accentCopy: string;
  featureCard1: FeatureCardLabels;
  featureCard2: FeatureCardLabels;
};

type HomeHeroCarouselProps = {
  slides: HomeHeroSlide[];
  labels: HomeHeroCarouselLabels;
  autoPlayIntervalMs?: number;
};

export function HomeHeroCarousel({
  slides,
  labels,
  autoPlayIntervalMs = 5000,
}: HomeHeroCarouselProps) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const totalSlides = slides.length;

  useEffect(() => {
    if (totalSlides < 2 || autoPlayIntervalMs <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveSlideIndex(
        (currentSlideIndex) => (currentSlideIndex + 1) % totalSlides,
      );
    }, autoPlayIntervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [autoPlayIntervalMs, totalSlides]);

  if (totalSlides === 0) {
    return null;
  }

  return (
    <div className={styles.carousel}>
      <div className={styles.viewport}>
        <div
          className={styles.track}
          style={{ transform: `translateX(-${activeSlideIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <article
              key={slide.id}
              className={`${styles.slide} ${styles[slide.themeClassName]}`}
            >
              <div className={styles.content}>
                <div className={styles.copy}>
                  <span className={styles.badge}>{slide.badge}</span>
                  <p className={styles.eyebrow}>{slide.eyebrow}</p>
                  <h1 className={styles.title}>{slide.title}</h1>
                  <p className={styles.description}>{slide.description}</p>

                  <div className={styles.actions}>
                    <Link
                      className={styles.primaryAction}
                      href={slide.primaryCtaHref}
                    >
                      {slide.primaryCtaLabel}
                    </Link>
                    <Link
                      className={styles.secondaryAction}
                      href={slide.secondaryCtaHref}
                    >
                      {slide.secondaryCtaLabel}
                    </Link>
                  </div>

                  <div className={styles.highlights}>
                    {slide.highlights.map((highlight) => (
                      <span key={highlight} className={styles.highlight}>
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={styles.media}>
                  <div className={styles.accentCard}>
                    <span className={styles.accentLabel}>
                      {slide.accentLabel}
                    </span>
                    <div className={styles.accentValue}>
                      {slide.accentValue}
                    </div>
                    <p className={styles.accentCopy}>{labels.accentCopy}</p>
                  </div>

                  <div className={styles.featureGrid}>
                    <div className={styles.featureCard}>
                      <span className={styles.featureTitle}>{labels.featureCard1.title}</span>
                      <strong className={styles.featureValue}>
                        {labels.featureCard1.value}
                      </strong>
                      <span className={styles.featureDescription}>
                        {labels.featureCard1.description}
                      </span>
                    </div>
                    <div className={styles.featureCard}>
                      <span className={styles.featureTitle}>{labels.featureCard2.title}</span>
                      <strong className={styles.featureValue}>
                        {labels.featureCard2.value}
                      </strong>
                      <span className={styles.featureDescription}>
                        {labels.featureCard2.description}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
