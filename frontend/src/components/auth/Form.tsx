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
import useUserStore from "@/store/userStore";
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

export default function AuthForm({ type }: { type: FormType }) {
  const { loginUser, registerUser, error, loading } = useUserStore();
  const { toast } = useToast();
  const router = useRouter();

  const [formType, setFormType] = useState<FormType>(type);
  const [formKey, setFormKey] = useState<number>(0);

  // schéma de validation du formulaire
  const formSchema = z.object({
    email: z.string().min(2, {
      message: "L'adresse mail doit être au bon format",
    }),
    name:
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
      name: "",
      password: "",
    },
  });

  const handleSwitchForm = () => {
    console.log("toto");
    form.reset();
    setFormKey((prevKey) => prevKey + 1);
    setFormType(
      formType === FormType.REGISTER ? FormType.LOGIN : FormType.REGISTER
    );
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // valeurs du formulaire
    const { email, name, password } = values;
    // création de compte
    if (formType === FormType.REGISTER) {
      try {
        const message = await registerUser(email, name || "", password);
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
            onSubmit={form.handleSubmit(onSubmit, (error) =>
              console.log(error)
            )}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@mail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {formType === FormType.REGISTER && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
