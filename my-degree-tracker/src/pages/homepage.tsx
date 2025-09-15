import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "../firestore/config";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [program, setProgram] = useState<string>("");
  const [totalCredits, setTotalCredits] = useState(0);
  const [completedCredits, setCompletedCredits] = useState(0);
  const [gpa, setGpa] = useState(0);
  const [assignments, setAssignments] = useState<string[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        try {
          const q = query(
            collection(firestore, "students"),
            where("email", "==", user.email),
            limit(1)
          );
          const snap = await getDocs(q);

          if (!snap.empty) {
            const student = snap.docs[0].data() as any;

            setStudentName(student.fullName);
            setProgram(student.program ?? "");
            setCompletedCredits(Number(student.completedCredits ?? 0));
            setTotalCredits(Number(student.totalCredits ?? 120));

            // ממוצע ציונים נשאר כמו קודם אם תרצה להשתמש ב-gradeSheet
            const grades = student.gradeSheet ?? {};
            const values = Object.values(grades).filter((g) => typeof g === "number");
            if (values.length > 0) {
              const avg = values.reduce((a, b) => a + b, 0) / values.length;
              setGpa(Number(avg.toFixed(2)));
            } else {
              setGpa(0);
            }

            // שמירה של כל ה-assignments מהסטודנט
            setAssignments(student.assignments ?? []);
          } else {
            console.warn("⚠️ לא נמצא סטודנט עם המייל הזה");
            setStudentName(user.email);
          }
        } catch (err) {
          console.error("❌ שגיאה בשליפת הסטודנט:", err);
          setStudentName(user.email ?? "סטודנט");
        }
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {!loading && (
        <>
          {/* ברכה אישית */}
          <Typography 
            variant="h5" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              textAlign: { xs: 'center', sm: 'left' },
              mb: { xs: 2, sm: 1 }
            }}
          >
            שלום, {studentName ?? "סטודנט"}! 👋
          </Typography>

          {/* תקציר מצב התואר */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(auto-fit, minmax(250px, 1fr))' 
            }, 
            gap: { xs: 1.5, sm: 2 }, 
            mb: { xs: 3, sm: 4 }
          }}>
            <Card sx={{ minHeight: { xs: 'auto', sm: 120 } }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography 
                  variant="h6"
                  sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                >
                  נק"ז שהושלמו
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ 
                    fontSize: { xs: '1.1rem', sm: '1rem' },
                    fontWeight: 'bold',
                    color: 'primary.main'
                  }}
                >
                  {completedCredits}/{totalCredits}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ minHeight: { xs: 'auto', sm: 120 } }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography 
                  variant="h6"
                  sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                >
                  ממוצע ציונים
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ 
                    fontSize: { xs: '1.1rem', sm: '1rem' },
                    fontWeight: 'bold',
                    color: 'secondary.main'
                  }}
                >
                  {gpa}
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ minHeight: { xs: 'auto', sm: 120 } }}>
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography 
                  variant="h6"
                  sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                >
                  תוכנית לימודים
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ 
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    wordBreak: 'break-word'
                  }}
                >
                  {program}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* טבלה של כל ה-assignments */}
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              mb: { xs: 1, sm: 2 }
            }}
          >
            משימות (Assignments)
          </Typography>
          <TableContainer 
            component={Paper} 
            sx={{ 
              mb: { xs: 3, sm: 4 },
              maxHeight: { xs: 300, sm: 'none' },
              overflow: 'auto'
            }}
          >
            <Table size={window.innerWidth < 600 ? 'small' : 'medium'}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                    שם משימה
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignments.map((assignment, idx) => (
                  <TableRow key={idx}>
                    <TableCell sx={{ 
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      py: { xs: 1, sm: 2 }
                    }}>
                      {assignment}
                    </TableCell>
                  </TableRow>
                ))}
                {assignments.length === 0 && (
                  <TableRow>
                    <TableCell 
                      align="center"
                      sx={{ 
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        py: { xs: 2, sm: 3 }
                      }}
                    >
                      אין משימות להצגה
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* קיצורי דרך */}
          <Box sx={{ mt: 2 }}>
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{ 
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                mb: { xs: 1.5, sm: 2 },
                textAlign: { xs: 'center', sm: 'left' }
              }}
            >
              קיצורי דרך
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { 
                xs: '1fr', 
                sm: 'repeat(auto-fit, minmax(180px, 1fr))' 
              }, 
              gap: { xs: 1.5, sm: 2 }
            }}>
              <Button 
                variant="contained" 
                component={Link} 
                to="/progress"
                sx={{ 
                  py: { xs: 1.5, sm: 1 },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                ההתקדמות שלי
              </Button>
              <Button 
                variant="contained" 
                component={Link} 
                to="/grade-report"
                sx={{ 
                  py: { xs: 1.5, sm: 1 },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                דו"ח ציונים
              </Button>
              <Button 
                variant="contained" 
                component={Link} 
                to="/my-courses"
                sx={{ 
                  py: { xs: 1.5, sm: 1 },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                הקורסים שלי
              </Button>
              <Button 
                variant="contained" 
                component={Link} 
                to="/my-program"
                sx={{ 
                  py: { xs: 1.5, sm: 1 },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                המסלול שלי
              </Button>
              <Button 
                variant="contained" 
                component={Link} 
                to="/help"
                sx={{ 
                  py: { xs: 1.5, sm: 1 },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                עזרה ותמיכה
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default HomePage;