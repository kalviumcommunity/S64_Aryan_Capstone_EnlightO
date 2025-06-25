import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchInstructorCourseDetailsService, updateCourseByIdService } from "@/services";
import { InstructorContext } from "@/context/instructor-context";
import { useContext } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseLanding from "@/components/instructor-view/courses/add-new-course/course-landing";
import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/course-curriculum";
import CourseSettings from "@/components/instructor-view/courses/add-new-course/course-settings";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function EditCoursePage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const {
    setCurrentEditedCourseId,
    courseLandingFormData,
    setCourseLandingFormData,
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    updateCourseInList,
  } = useContext(InstructorContext);

  async function fetchCourseDetails() {
    try {
      setIsLoading(true);
      setError("");
      const response = await fetchInstructorCourseDetailsService(courseId);
      if (response?.success) {
        setCurrentEditedCourseId(courseId);
        setCourseLandingFormData({
          title: response.data.title || "",
          category: response.data.category || "",
          level: response.data.level || "",
          primaryLanguage: response.data.primaryLanguage || "",
          subtitle: response.data.subtitle || "",
          description: response.data.description || "",
          pricing: response.data.pricing || "",
          objectives: response.data.objectives || "",
          welcomeMessage: response.data.welcomeMessage || "",
          image: response.data.image || "",
        });
        setCourseCurriculumFormData(response.data.curriculum || []);
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to fetch course details");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveChanges() {
    try {
      setIsSaving(true);
      setError("");

      const formData = {
        ...courseLandingFormData,
        curriculum: courseCurriculumFormData,
      };

      const response = await updateCourseByIdService(courseId, formData);
      
      if (response?.success) {
        // Update the course in the instructor's course list
        updateCourseInList(courseId, formData);
        toast.success("Course updated successfully");
        navigate("/instructor");
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to update course");
      toast.error(error?.response?.data?.message || "Failed to update course");
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    fetchCourseDetails();
    // Cleanup function to reset form data when component unmounts
    return () => {
      setCurrentEditedCourseId(null);
      setCourseLandingFormData({});
      setCourseCurriculumFormData([]);
    };
  }, [courseId]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Card className="p-6">
          <Skeleton className="h-96" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit Course</h1>
        <Button 
          onClick={handleSaveChanges} 
          disabled={isSaving}
          className="bg-primary text-white"
        >
          {isSaving ? "Saving Changes..." : "Save Changes"}
        </Button>
      </div>
      <Tabs defaultValue="course-landing" className="space-y-4">
        <TabsList>
          <TabsTrigger value="course-landing">Course Landing</TabsTrigger>
          <TabsTrigger value="course-curriculum">Course Curriculum</TabsTrigger>
          <TabsTrigger value="course-settings">Course Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="course-landing">
          <CourseLanding isEdit={true} />
        </TabsContent>
        <TabsContent value="course-curriculum">
          <CourseCurriculum isEdit={true} />
        </TabsContent>
        <TabsContent value="course-settings">
          <CourseSettings isEdit={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default EditCoursePage; 