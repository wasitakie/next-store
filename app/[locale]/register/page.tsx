"use client";

import { useActionState, startTransition } from "react";
import { loginWithGoogle, registerUser } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/routing";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

const getRegisterSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("errors.requiredName")),
    email: z.string().email(t("errors.invalidEmail")),
    password: z.string().min(8, t("errors.passwordLength")),
  });

type RegisterInput = z.infer<ReturnType<typeof getRegisterSchema>>;

export default function RegisterPage() {
  const t = useTranslations("Auth");
  const registerSchema = getRegisterSchema(t);

  // 2. ตั้งค่า React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors: clientErrors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  // 3. ตั้งค่า Server Action (ดึงค่า state มาจากหลังบ้าน)
  const [state, formAction, isPending] = useActionState(registerUser, null);

  // 4. ฟังก์ชันจัดการเมื่อกด Submit
  const onSubmit = (data: RegisterInput) => {
    // ใช้ startTransition เพื่อให้ทำงานร่วมกับ useActionState ได้
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formAction(formData);
    });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {t("registerTitle")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("registerDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={loginWithGoogle} className="flex items-center mt-3">
            <Button type="submit" variant="outline" className="w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="w-4 h-4 mr-2"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
              {t("registerWithGoogle")}
            </Button>
          </form>
          <div className="flex items-center mx-5">
            <span className="border border-gray-300 w-full"></span>
            <span className="mx-2 text-lg text-gray-400">{t("or")}</span>
            <span className="border border-gray-300 w-full"></span>
          </div>
          {/* เปลี่ยนจาก action เป็น onSubmit ของ hook form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Error รวมจาก Server */}
            {state?.error && (
              <div className="text-destructive text-sm text-center font-medium">
                {state.error}
              </div>
            )}

            {/* Field: Name */}
            <div className="space-y-2">
              <Label htmlFor="name">{t("name")}</Label>
              <Input
                {...register("name")}
                id="name"
                type="text"
                placeholder={t("namePlaceholder")}
                className={clientErrors.name ? "border-destructive" : ""}
              />
              {clientErrors.name && (
                <p className="text-xs font-medium text-destructive">
                  {clientErrors.name.message}
                </p>
              )}
            </div>

            {/* Field: Email */}
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                className={clientErrors.email ? "border-destructive" : ""}
              />
              {clientErrors.email && (
                <p className="text-xs font-medium text-destructive">
                  {clientErrors.email.message}
                </p>
              )}
            </div>

            {/* Field: Password */}
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                {...register("password", {
                  required: t("errors.requiredPassword"),
                  minLength: {
                    value: 8,
                    message: t("errors.passwordLength"),
                  },
                })}
                id="password"
                type="password"
                placeholder={t("passwordPlaceholder")}
                className={clientErrors.password ? "border-destructive" : ""}
              />
              {clientErrors.password && (
                <p className="text-xs font-medium text-destructive">
                  {clientErrors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? t("registering") : t("registerButton")}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            {t("haveAccount")}{" "}
            <Link href="/login" className="text-primary hover:underline">
              {t("loginHere")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
