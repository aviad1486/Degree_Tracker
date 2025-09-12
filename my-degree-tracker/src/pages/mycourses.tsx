import React, { useState, useEffect } from "react";
import { Box, Typography, LinearProgress, Card, CardContent } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const MyCourses: React.FC = () => {
  const [loading, setLoading] = useState(true);

  // Mock data (בשלב מאוחר יותר נביא מ-Firestore)
  const rows = [
    { id: 1, courseName: "מבוא למדעי המחשב", grade: 90, year: 1, semester: "א" },
    { id: 2, courseName: "מערכות הפעלה", grade: 87, year: 2, semester: "ב" },
    { id: 3, courseName: "בינה מלאכותית", grade: 95, year: 3, semester: "א" },
    { id: 4, courseName: "בסיסי נתונים", grade: 89, year: 2, semester: "א" },
  ];

  const columns = [
    { field: "courseName", headerName: "שם קורס", flex: 1 },
    { field: "grade", headerName: "ציון", width: 100 },
    { field: "year", headerName: "שנה", width: 100 },
    { field: "semester", headerName: "סמסטר", width: 100 },
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
            הקורסים שלי 📚
          </Typography>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                רשימת קורסים שעברתי
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

export default MyCourses;
