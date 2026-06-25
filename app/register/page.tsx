import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { register } from "./actions";

type RegisterPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { message } = await searchParams;

  return (
    <main className="min-h-screen bg-[#f7f7f3]">
      <header className="bg-[#082c3c] text-white">
        <div className="mx-auto flex h-24 w-full max-w-[1440px] items-center justify-between px-8 lg:px-12">
          <Link
            href="/"
            className="font-[var(--font-display)] text-[26px] font-medium tracking-[-0.04em]"
          >
            SIGMA-Sholat
          </Link>
          <Link href="/login" className="text-base font-medium text-white/88 hover:text-white">
            Already have an account?
          </Link>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-center px-8 py-16 lg:px-12 lg:py-20">
        <Card className="w-full max-w-3xl border-[#dce4df] bg-white shadow-none">
          <CardHeader className="auth-copy border-b border-[#e3e8e5] pb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0f7a51]">
              Register
            </p>
            <CardTitle className="auth-title">Buat akun SIGMA-Sholat</CardTitle>
          <CardDescription>
            Registrasi disiapkan untuk siswa dan guru agar dapat mengakses
            materi, progres pembelajaran, dan fitur pendamping lainnya.
          </CardDescription>
          </CardHeader>

          <CardContent className="pt-8">
            <form action={register} className="auth-form">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="register-name">Nama Lengkap</FieldLabel>
                  <FieldContent>
                    <Input
                      id="register-name"
                      name="fullName"
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      className="h-12 rounded-md border-[#cfd9d3] bg-white px-4"
                      required
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="register-email">Email</FieldLabel>
                  <FieldContent>
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      placeholder="nama@contoh.com"
                      className="h-12 rounded-md border-[#cfd9d3] bg-white px-4"
                      required
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="register-password">Password</FieldLabel>
                  <FieldContent>
                    <Input
                      id="register-password"
                      name="password"
                      type="password"
                      placeholder="Buat password"
                      className="h-12 rounded-md border-[#cfd9d3] bg-white px-4"
                      required
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="register-role">Peran</FieldLabel>
                  <FieldContent>
                    <Input
                      id="register-role"
                      name="role"
                      type="text"
                      defaultValue="student"
                      className="h-12 rounded-md border-[#cfd9d3] bg-white px-4"
                      required
                    />
                  </FieldContent>
                </Field>
              </FieldGroup>

              {message ? <p className="text-sm text-[#b42318]">{message}</p> : null}

              <Button
                type="submit"
                size="lg"
                className="h-14 w-full rounded-md border-0 bg-[#00ed64] text-[17px] font-semibold text-[#082c3c] hover:bg-[#00d65b]"
              >
                Registrasi
              </Button>
            </form>

            <Separator className="my-6 bg-[#dce4df]" />

            <div className="flex flex-wrap justify-between gap-3 text-sm font-medium text-[#0f7a51]">
              <Link href="/login">Sudah punya akun? Login</Link>
              <Link href="/">Kembali ke landing page</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
