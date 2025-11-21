import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  CircularProgress,
  Avatar
} from "@mui/material";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);

    setTimeout(() => {
      console.log("Signup data:", data);
      toast.success("Account created successfully! Please sign in.");
      setIsLoading(false);
      navigate("/login");
    }, 1000);
  };

  return (
    <Box className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 450 }}
      >
        <Card elevation={4}>
          <CardContent sx={{ p: 4 }}>
            <Box textAlign="center" mb={4}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                <UserPlus size={32} />
              </Avatar>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign up to get started
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Box display="flex" flexDirection="column" gap={2.5}>
                <TextField
                  fullWidth
                  label="Full Name"
                  type="text"
                  placeholder="Enter your full name"
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  placeholder="Create a password"
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  variant="outlined"
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isLoading}
                  sx={{ mt: 1 }}
                >
                  {isLoading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Creating account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </Box>
            </form>

            <Box mt={3} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
                  Sign in
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default Signup;
