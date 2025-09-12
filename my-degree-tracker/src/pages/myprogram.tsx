import React, { useState, useEffect } from "react";
import { Box, Typography, LinearProgress, Card, CardContent } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const MyProgram: React.FC = () => {
  const [loading, setLoading] = useState(true);

  // Mock data (בשלב מאוחר יותר נחבר ל-Firestore)
  const programName = "מדעי המחשב";
  const totalCreditsRequired = 120;

  const rows = [
    { id: 1, courseName: "מבוא למדעי המחשב", credits: 5, semester: "א" },
    { id: 2, courseName: "מערכות הפעלה", credits: 4, semester: "ב" },
    { id: 3, courseName: "בינה מלאכותית", credits: 4, semester: "ג" },
    { id: 4, courseName: "בסיסי נתונים", credits: 3, semester: "ב" },
  ];

  const columns = [
    { field: "courseName", headerName: "שם קורס", flex: 1 },
    { field: "credits", headerName: "נקז", width: 100 },
    { field: "semester", headerName: "סמסטר מוצע", width: 150 },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {!loading && (
        <>
          <Typography variant="h5" gutterBottom>
            המסלול שלי 🎓
          </Typography>

          {/* פרטי מסלול */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6">שם המסלול: {programName}</Typography>
              <Typography variant="body1">
                סך נק"ז נדרש: {totalCreditsRequired}
              </Typography>
            </CardContent>
          </Card>

          {/* טבלת קורסים במסלול */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                רשימת קורסים במסלול
              </Typography>
              <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSizeOptions={[5]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default MyProgram;
