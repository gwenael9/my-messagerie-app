import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "@/stores/authStore";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useRouter } from "next/router";

export enum FormType {
  REGISTER = "REGISTER",
  LOGIN = "LOGIN",
}

type nameField = "firstname" | "lastname" | "email" | "password";

export default function AuthForm() {
  const { loginUser, registerUser, error, loading } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();

  const [formType, setFormType] = useState<FormType>(FormType.LOGIN);
  const [formKey, setFormKey] = useState<number>(0);

  // schéma de validation du formulaire
  const formSchema = z.object({
    email: z.string().min(2, {
      message: "L'adresse mail doit être au bon format",
    }),
    firstname:
      formType === FormType.REGISTER
        ? z.string().min(2, {
            message: "Votre nom doit contenir au moins 2 caractères",
          })
        : z.string().optional(),
    lastname:
      formType === FormType.REGISTER
        ? z.string().min(2, {
            message: "Votre nom doit contenir au moins 2 caractères",
          })
        : z.string().optional(),
    password: z
      .string()
      .min(3, "Le mot de passe doit contenir au moins 6 caractères"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstname: "",
      lastname: "",
      password: "",
    },
  });

  const handleSwitchForm = () => {
    form.reset();
    setFormKey((prevKey) => prevKey + 1);
    setFormType(
      formType === FormType.REGISTER ? FormType.LOGIN : FormType.REGISTER
    );
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // valeurs du formulaire
    const { email, firstname, lastname, password } = values;
    // création de compte
    if (formType === FormType.REGISTER) {
      try {
        const message = await registerUser(
          email,
          firstname || "",
          lastname || "",
          password
        );
        if (message) {
          toast({
            title: message,
          });
        }
        setFormType(FormType.LOGIN);
      } catch (err) {
        toast({
          title: error || "Erreur lors de l'inscription",
          variant: "destructive",
        });
      }
    }
    // connexion
    else {
      const message = await loginUser(email, password);
      if (message) {
        toast({
          title: message,
        });
        router.push("/");
      }
      if (error) {
        toast({
          title: error,
          variant: "destructive",
        });
      }
    }
  };

  const title =
    formType === FormType.LOGIN ? "Se connecter" : "Créer votre compte";

  const formField = (name: nameField, label: string, placeholder?: string) => {
    let type: string;
    if (name == "password") {
      type = "password";
    }
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input type={type} placeholder={placeholder} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Card className="bg-white w-[500px]">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>
          Veuillez renseigner les informations ci-dessous.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form key={formKey} {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {formField("email", "Email", "example@mail.com")}
            {formType === FormType.REGISTER && (
              <>
                {formField("lastname", "Nom", "Votre nom")}
                {formField("firstname", "Prénom", "Votre prénom")}
              </>
            )}
            {formField("password", "Mot de passe")}
            <div className="flex justify-between items-center">
              <p className="text-xs text-center">
                {formType === FormType.REGISTER
                  ? "Vous avez déjà un compte ?"
                  : "Vous n'avez pas de compte ?"}{" "}
                <Button
                  type="button"
                  variant="link"
                  size="link"
                  className="text-xs"
                  onClick={handleSwitchForm}
                >
                  {formType === FormType.REGISTER
                    ? "Se connecter"
                    : "Créer un compte"}
                </Button>
              </p>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : formType === FormType.REGISTER ? (
                  "Créer un compte"
                ) : (
                  "Connexion"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
