import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/course-curriculum";
import CourseLanding from "@/components/instructor-view/courses/add-new-course/course-landing";
import CourseSettings from "@/components/instructor-view/courses/add-new-course/course-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import {
  addNewCourseService,
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
} from "@/services";
import { Loader2 } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AddNewCoursePage() {
  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log(params);

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    return value === "" || value === null || value === undefined;
  }

  function validateFormData() {
    console.log("Validating form data...");
    console.log("Landing form data:", courseLandingFormData);
    console.log("Curriculum form data:", courseCurriculumFormData);
    
    // Check landing form data (except image which is optional)
    for (const key in courseLandingFormData) {
      // Skip the image field check as it's not required
      if (key === 'image') continue;
      
      if (isEmpty(courseLandingFormData[key])) {
        console.log(`Landing form validation failed on field: ${key}`);
        return false;
      }
    }

    // Check if we have at least one curriculum item
    if (courseCurriculumFormData.length === 0) {
      console.log("No curriculum items found");
      return false;
    }

    // Check each curriculum item
    for (const item of courseCurriculumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      ) {
        console.log("Curriculum item validation failed:", item);
        return false;
      }
    }

    console.log("Form validation passed");
    return true;
  }

  async function handleCreateCourse() {
    try {
      setIsSubmitting(true);
      console.log("Starting course creation...");
      
      const courseFinalFormData = {
        instructorId: auth?.user?._id,
        instructorName: auth?.user?.userName,
        date: new Date(),
        ...courseLandingFormData,
        students: [],
        curriculum: courseCurriculumFormData,
        isPublised: true,
      };

      console.log("Submitting course data:", courseFinalFormData);
      console.log("Auth state:", auth);

      // Decide whether to update or create new course
      const action = currentEditedCourseId !== null ? "update" : "create";
      console.log(`Performing ${action} action...`);

      try {
        const response = currentEditedCourseId !== null
          ? await updateCourseByIdService(currentEditedCourseId, courseFinalFormData)
          : await addNewCourseService(courseFinalFormData);
        
        console.log("API response:", response);

        if (response?.success) {
          console.log("Course saved successfully!");
          toast({
            title: currentEditedCourseId ? "Course updated!" : "Course created!",
            description: "Your course has been saved successfully.",
          });
          setCourseLandingFormData(courseLandingInitialFormData);
          setCourseCurriculumFormData(courseCurriculumInitialFormData);
          navigate(-1);
          setCurrentEditedCourseId(null);
        } else {
          console.error("API returned error:", response);
          toast({
            title: "Error",
            description: response?.message || "Failed to save course. Please try again.",
            variant: "destructive",
          });
        }
      } catch (apiError) {
        console.error("API call failed:", apiError);
        toast({
          title: "API Error",
          description: "Failed to communicate with the server. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Course creation error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      console.log("Course creation process completed");
      setIsSubmitting(false);
    }
  }

  async function fetchCurrentCourseDetails() {
    const response = await fetchInstructorCourseDetailsService(
      currentEditedCourseId
    );

    if (response?.success) {
      const setCourseFormData = Object.keys(
        courseLandingInitialFormData
      ).reduce((acc, key) => {
        acc[key] = response?.data[key] || courseLandingInitialFormData[key];

        return acc;
      }, {});

      console.log(setCourseFormData, response?.data, "setCourseFormData");
      setCourseLandingFormData(setCourseFormData);
      setCourseCurriculumFormData(response?.data?.curriculum);
    }

    console.log(response, "response");
  }

  useEffect(() => {
    if (currentEditedCourseId !== null) fetchCurrentCourseDetails();
  }, [currentEditedCourseId]);

  useEffect(() => {
    if (params?.courseId) setCurrentEditedCourseId(params?.courseId);
  }, [params?.courseId]);

  console.log(params, currentEditedCourseId, "params");

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold mb-5">
          {currentEditedCourseId ? "Edit course" : "Create a new course"}
        </h1>
        <div className="flex gap-3">
          {process.env.NODE_ENV === 'development' && (
            <Button
              variant="outline"
              className="text-sm tracking-wider font-bold px-8"
              onClick={() => {
                console.log("Force submitting form...");
                handleCreateCourse();
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Debug Submit
                </>
              ) : (
                "Debug Submit"
              )}
            </Button>
          )}
          <Button
            disabled={!validateFormData() || isSubmitting}
            className="text-sm tracking-wider font-bold px-8"
            onClick={handleCreateCourse}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {currentEditedCourseId ? "Updating..." : "Submitting..."}
              </>
            ) : (
              "SUBMIT"
            )}
          </Button>
        </div>
      </div>
      <Card>
        <CardContent>
          <div className="container mx-auto p-4">
            <Tabs defaultValue="curriculum" className="space-y-4">
              <TabsList>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="course-landing-page">
                  Course Landing Page
                </TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="curriculum">
                <CourseCurriculum />
              </TabsContent>
              <TabsContent value="course-landing-page">
                <CourseLanding />
              </TabsContent>
              <TabsContent value="settings">
                <CourseSettings />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddNewCoursePage;
