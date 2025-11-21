import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { LogOut, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Submission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  residentialStreet1: string;
  residentialStreet2: string;
  permanentStreet1?: string;
  permanentStreet2?: string;
  documents: Array<{
    fileName: string;
    fileType: string;
    file: string;
  }>;
  submittedAt: string;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState<Submission | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

    if (!isAuthenticated || !isAdmin) {
      toast.error("Access denied. Admin only.");
      navigate("/login");
      return;
    }

    // Load submissions from localStorage
    loadSubmissions();
  }, [navigate]);

  const loadSubmissions = () => {
    const data = JSON.parse(localStorage.getItem("formSubmissions") || "[]");
    setSubmissions(data);
  };

  const handleDelete = (id: string) => {
    const submission = submissions.find((s) => s.id === id);
    setSelectedRow(submission || null);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedRow) {
      const updated = submissions.filter((s) => s.id !== selectedRow.id);
      localStorage.setItem("formSubmissions", JSON.stringify(updated));
      setSubmissions(updated);
      toast.success("Submission deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedRow(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("isAdmin");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const filteredSubmissions = useMemo(() => {
    return submissions.filter(
      (submission) =>
        submission.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [submissions, searchTerm]);

  const columns: GridColDef[] = [
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "dateOfBirth", headerName: "Date of Birth", width: 130 },
    {
      field: "submittedAt",
      headerName: "Submitted At",
      width: 180,
      valueFormatter: (params) => new Date(params).toLocaleString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDelete(params.row.id)}
          size="small"
        >
          <Trash2 size={18} />
        </IconButton>
      ),
    },
  ];

  return (
    <Box className="min-h-screen bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box maxWidth="1400px" mx="auto">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
            flexWrap="wrap"
            gap={2}
          >
            <Typography variant="h4" fontWeight="bold">
              Admin Panel
            </Typography>
            <Button
              variant="outlined"
              onClick={handleLogout}
              startIcon={<LogOut size={18} />}
            >
              Logout
            </Button>
          </Box>

          <Card elevation={3}>
            <CardContent>
              <Box mb={3}>
                <TextField
                  fullWidth
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search size={20} style={{ marginRight: 8 }} />,
                  }}
                />
              </Box>

              <Box sx={{ height: 600, width: "100%" }}>
                <DataGrid
                  rows={filteredSubmissions}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10 },
                    },
                  }}
                  pageSizeOptions={[5, 10, 25, 50]}
                  checkboxSelection
                  disableRowSelectionOnClick
                />
              </Box>

              <Box mt={3}>
                <Typography variant="body2" color="text.secondary">
                  Total Submissions: {submissions.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the submission from{" "}
            <strong>
              {selectedRow?.firstName} {selectedRow?.lastName}
            </strong>
            ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPanel;
