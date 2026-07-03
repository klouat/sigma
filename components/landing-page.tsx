import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  landingFeatures,
  landingWorkflow,
  teamMembers,
} from "@/lib/site-data";

export function LandingPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f3] text-[#112b33]">
      <header className="sticky top-0 z-50 bg-[#082c3c] text-white shadow-sm">
        <div className="mx-auto flex h-24 w-full max-w-[1440px] items-center gap-6 px-8 lg:px-12">
          <Link
            href="/"
            className="shrink-0 font-[var(--font-display)] text-[26px] font-medium tracking-[-0.04em]"
          >
            SIGMA-Sholat
          </Link>

          <div className="ml-auto hidden items-center gap-5 lg:flex">
            <Link href="/login" className="text-[17px] font-medium text-white/95 hover:text-white">
              Login
            </Link>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-14 rounded-md border-0 bg-[#00ed64] px-8 text-[17px] font-semibold text-[#082c3c] hover:bg-[#00d65b]"
              )}
            >
              Register
            </Link>
          </div>

          <div className="ml-auto flex lg:hidden">
            <Link
              href="/register"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 rounded-md border-0 bg-[#00ed64] px-5 text-sm font-semibold text-[#082c3c] hover:bg-[#00d65b]"
              )}
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <section className="relative min-h-[calc(100svh-6rem)] overflow-hidden bg-[#082c3c] text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1674135140000-dadd7a9d8d6f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Pembelajaran inklusif berbasis visual"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,44,60,0.92)_0%,rgba(8,44,60,0.72)_34%,rgba(8,44,60,0.38)_62%,rgba(8,44,60,0.52)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,44,60,0.12)_0%,rgba(8,44,60,0.48)_100%)]" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100svh-6rem)] w-full max-w-[1440px] items-end px-8 pb-14 pt-16 lg:px-12 lg:pb-20">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#8ee9bb]">
              SIGMA-Sholat
            </p>
            <h1 className="max-w-3xl font-[var(--font-display)] text-5xl leading-[0.93] font-medium tracking-[-0.06em] text-balance sm:text-6xl lg:text-[88px]">
              Belajar sholat secara visual.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/78">
              Dibuat untuk siswa tunarungu dengan pendekatan BISINDO dan alur belajar yang sederhana.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-14 rounded-md border-0 bg-[#00ed64] px-8 text-[17px] font-semibold text-[#082c3c] hover:bg-[#00d65b]"
                )}
              >
                Register
              </Link>
              <Link
                href="#fitur"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-14 rounded-md border-white/20 bg-transparent px-8 text-[17px] font-medium text-white hover:bg-white/8 hover:text-white"
                )}
              >
                Lihat Fitur
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="fitur" className="mx-auto w-full max-w-[1440px] px-8 py-20 lg:px-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0f7a51]">
            Tujuan aplikasi
          </p>
          <h2 className="mt-4 font-[var(--font-display)] text-4xl leading-tight font-medium tracking-[-0.05em] text-[#102c35] sm:text-5xl">
            Platform pembelajaran PAI yang lebih adil, adaptif, dan mudah dipahami.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#4d636b]">
            SIGMA-Sholat dirancang untuk membantu siswa tunarungu memahami
            materi sholat sekaligus memberi guru media belajar yang visual,
            komunikatif, dan terstruktur.
          </p>
        </div>

        <Separator className="my-10 bg-[#d8dfdc]" />

        <div className="grid gap-6 lg:grid-cols-2">
          {landingFeatures.map((feature, index) => (
            <Card
              key={feature.title}
              className="border-[#dce4df] bg-white shadow-none transition hover:border-[#b9c7c0]"
            >
              <CardHeader className="gap-4">
                <div className="font-[var(--font-display)] text-2xl tracking-[-0.05em] text-[#0f7a51]">
                  0{index + 1}
                </div>
                <CardTitle className="font-[var(--font-display)] text-[28px] leading-tight tracking-[-0.04em] text-[#102c35]">
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-base leading-7 text-[#4d636b]">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section id="bisindo" className="bg-white">
        <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-8 py-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:px-12">
          <div id="tentang" className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0f7a51]">
              Pembelajaran berbasis BISINDO
            </p>
            <h2 className="mt-4 font-[var(--font-display)] text-4xl leading-tight font-medium tracking-[-0.05em] text-[#102c35] sm:text-5xl">
              Bahasa isyarat bukan pelengkap, tetapi fondasi komunikasi belajar.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#4d636b]">
              Proposal menekankan kebutuhan pendekatan visual, multimodal, dan
              sederhana. Karena itu, materi SIGMA-Sholat memadukan BISINDO,
              visual gerakan, dan urutan belajar yang terarah agar siswa lebih
              mudah memahami makna dan praktik sholat.
            </p>
          </div>

          <div className="grid gap-0 rounded-2xl border border-[#dce4df] bg-[#f8faf8]">
            {landingWorkflow.map((step, index) => (
              <div
                key={step}
                className="flex items-start gap-5 px-6 py-5 not-last:border-b not-last:border-[#dce4df]"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#dff7e9] font-semibold text-[#0f7a51]">
                  {index + 1}
                </div>
                <p className="pt-1 text-base leading-7 text-[#26414a]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-8 py-20 lg:px-12">
        <div className="grid gap-10 rounded-[28px] bg-[#edf5f0] px-8 py-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:px-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0f7a51]">
              Fitur utama
            </p>
            <h2 className="mt-4 font-[var(--font-display)] text-4xl leading-tight font-medium tracking-[-0.05em] text-[#102c35] sm:text-5xl">
              Materi interaktif, latihan kamera, dan progres belajar dalam satu alur.
            </h2>
          </div>
          <div className="grid gap-5">
            {[
              "Dashboard siswa yang visual dan mudah dinavigasi.",
              "Riwayat latihan dan gamifikasi untuk menjaga motivasi belajar.",
              "Dashboard guru untuk memantau skor, progres, dan keterlibatan siswa.",
            ].map((item) => (
              <div key={item} className="flex items-start gap-4">
                <ArrowRight className="mt-1 size-5 text-[#0f7a51]" />
                <p className="text-base leading-7 text-[#26414a]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="kontak" className="border-t border-[#dce4df] bg-white">
        <div className="mx-auto grid w-full max-w-[1440px] gap-10 px-8 py-20 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0f7a51]">
              Tim pengembang
            </p>
            <h2 className="mt-4 font-[var(--font-display)] text-4xl leading-tight font-medium tracking-[-0.05em] text-[#102c35] sm:text-5xl">
              Dikembangkan oleh tim mahasiswa Universitas Brawijaya.
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#4d636b]">
              SIGMA-Sholat disusun untuk mendukung pembelajaran sholat inklusif
              di SLB ABD Negeri Kedungkandang dan lingkungan pendidikan khusus
              yang membutuhkan media belajar yang lebih aksesibel.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-14 rounded-md border-[#cfd9d3] px-8 text-[17px] text-[#102c35]"
                )}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-14 rounded-md border-0 bg-[#00ed64] px-8 text-[17px] font-semibold text-[#082c3c] hover:bg-[#00d65b]"
                )}
              >
                Register
              </Link>
            </div>
          </div>

          <Card className="border-[#dce4df] bg-[#f8faf8] shadow-none">
            <CardHeader>
              <CardTitle className="font-[var(--font-display)] text-[28px] tracking-[-0.04em] text-[#102c35]">
                Kontak tim
              </CardTitle>
              <CardDescription className="text-base leading-7 text-[#4d636b]">
                Untuk kolaborasi, pengembangan, atau implementasi lebih lanjut.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member} className="border-b border-[#dce4df] pb-3 text-[#26414a] last:border-b-0 last:pb-0">
                    {member}
                  </div>
                ))}
              </div>
              <Separator className="bg-[#dce4df]" />
              <div className="space-y-2 text-base text-[#26414a]">
                <a href="mailto:sigma.sholat@ub.ac.id" className="block hover:text-[#0f7a51]">
                  sigma.sholat@ub.ac.id
                </a>
                <p>Malang, Jawa Timur</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
