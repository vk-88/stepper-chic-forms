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
import { LogIn } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    // Check for admin credentials
    if (data.email === "admin@admin.com" && data.password === "admin123") {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("isAdmin", "true");
      toast.success("Welcome Admin!");
      setIsLoading(false);
      navigate("/admin");
      return;
    }

    // Regular user login
    setTimeout(() => {
      console.log("Login data:", data);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("isAdmin", "false");
      toast.success("Logged in successfully!");
      setIsLoading(false);
      navigate("/form");
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
                <LogIn size={32} />
              </Avatar>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to access your account
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Box display="flex" flexDirection="column" gap={3}>
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
                  placeholder="Enter your password"
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
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
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </Box>
            </form>

            <Box mt={3} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
                  Sign up
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default Login;
