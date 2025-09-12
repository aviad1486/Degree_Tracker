import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Card,
  CardContent,
} from "@mui/material";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DataGrid } from "@mui/x-data-grid";

const GradeReport: React.FC = () => {
  const [loading, setLoading] = useState(true);

  // Mock data (בשלב מאוחר יותר יגיע מ-Firestore)
  const gradesBySemester = [
    { semester: "שנה א - סמס' א", avg: 85 },
    { semester: "שנה א - סמס' ב", avg: 88 },
    { semester: "שנה ב - סמס' א", avg: 91 },
    { semester: "שנה ב - סמס' ב", avg: 89 },
    { semester: "שנה ג - סמס' א", avg: 93 },
  ];

  const courses = [
    { id: 1, courseName: "מבוא למדעי המחשב", grade: 90, year: 1, semester: "א" },
    { id: 2, courseName: "מערכות הפעלה", grade: 87, year: 2, semester: "ב" },
    { id: 3, courseName: "בינה מלאכותית", grade: 95, year: 3, semester: "א" },
    { id: 4, courseName: "בסיסי נתונים", grade: 89, year: 2, semester: "א" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const columns: GridColDef[] = [
    { field: "courseName", headerName: "שם קורס", flex: 1 },
    { field: "grade", headerName: "ציון", width: 100 },
    { field: "year", headerName: "שנה", width: 100 },
    { field: "semester", headerName: "סמסטר", width: 100 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {!loading && (
        <>
          <Typography variant="h5" gutterBottom>
            דו"ח ציונים 📈
          </Typography>

          {/* גרף ממוצעים */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ממוצע ציונים לפי סמסטר
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={gradesBySemester}>
                  <CartesianGrid stroke="#ccc" />
                  <XAxis dataKey="semester" />
                  <YAxis domain={[70, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="avg" stroke="#0077cc" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* טבלת ציונים */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                פירוט ציונים
              </Typography>
              <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={courses}
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

export default GradeReport;
