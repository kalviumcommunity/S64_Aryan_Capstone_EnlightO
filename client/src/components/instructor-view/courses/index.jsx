import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { Delete, Edit, AlertTriangle, Loader2 } from "lucide-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

function InstructorCourses({ listOfCourses }) {
  const navigate = useNavigate();
  const [deletingCourseId, setDeletingCourseId] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const {
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    deleteCourse,
  } = useContext(InstructorContext);

  function handleOpenDeleteDialog(courseId) {
    setDeletingCourseId(courseId);
    setDeleteError("");
    setIsConfirmDialogOpen(true);
  }

  function handleCloseDeleteDialog() {
    setIsConfirmDialogOpen(false);
    setDeletingCourseId(null);
    setDeleteError("");
  }

  async function handleDeleteCourse() {
    if (!deletingCourseId) return;
    
    try {
      await deleteCourse(deletingCourseId);
      toast.success("Course deleted successfully");
      handleCloseDeleteDialog();
    } catch (error) {
      setDeleteError(error?.response?.data?.message || "Failed to delete course");
      toast.error(error?.response?.data?.message || "Failed to delete course");
    }
  }

  const courseBeingDeleted = listOfCourses?.find(course => course._id === deletingCourseId);

  return (
    <Card>
      <CardHeader className="flex justify-between flex-row items-center">
        <CardTitle className="text-3xl font-extrabold">All Courses</CardTitle>
        <Button
          onClick={() => {
            setCurrentEditedCourseId(null);
            setCourseLandingFormData(courseLandingInitialFormData);
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
            navigate("/instructor/create-new-course");
          }}
          className="p-6"
        >
          Create New Course
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listOfCourses && listOfCourses.length > 0
                ? listOfCourses.map((course) => (
                    <TableRow key={course?._id}>
                      <TableCell className="font-medium">
                        {course?.title}
                      </TableCell>
                      <TableCell>{course?.students?.length || 0}</TableCell>
                      <TableCell>
                        ${(course?.students?.length || 0) * (course?.pricing || 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => {
                            navigate(`/instructor/edit-course/${course?._id}`);
                          }}
                          variant="ghost"
                          size="sm"
                        >
                          <Edit className="h-5 w-5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleOpenDeleteDialog(course?._id)}
                        >
                          <Delete className="h-5 w-5 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Course: {courseBeingDeleted?.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Are you sure you want to delete this course? This action cannot be undone.</p>
              
              {courseBeingDeleted && (
                <div className="bg-gray-100 p-3 rounded-md mt-2">
                  <p><strong>Course:</strong> {courseBeingDeleted.title}</p>
                  <p><strong>Students Enrolled:</strong> {courseBeingDeleted.students?.length || 0}</p>
                  <p><strong>Revenue:</strong> ${(courseBeingDeleted.students?.length || 0) * (courseBeingDeleted.pricing || 0)}</p>
                </div>
              )}
              
              {courseBeingDeleted?.students?.length > 0 && (
                <div className="text-red-500 bg-red-50 p-3 rounded-md font-medium">
                  Warning: This course has {courseBeingDeleted.students.length} enrolled students. 
                  Deleting it will remove their access.
                </div>
              )}
              
              {deleteError && (
                <p className="text-red-500 mt-2 p-2 border border-red-300 rounded-md bg-red-50">
                  {deleteError}
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCourse}
              disabled={deletingCourseId === null}
              className="bg-red-500 hover:bg-red-600"
            >
              {deletingCourseId === null ? (
                "Delete"
              ) : (
                "Permanently Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

export default InstructorCourses;
