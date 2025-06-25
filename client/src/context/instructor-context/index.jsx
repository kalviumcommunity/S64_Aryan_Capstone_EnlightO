import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { deleteCourseService } from "@/services";
import { createContext, useState } from "react";

export const InstructorContext = createContext(null);

export default function InstructorProvider({ children }) {
  const [courseLandingFormData, setCourseLandingFormData] = useState(
    courseLandingInitialFormData
  );
  const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(
    courseCurriculumInitialFormData
  );
  const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
  const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] =
    useState(0);
  const [instructorCoursesList, setInstructorCoursesList] = useState([]);
  const [currentEditedCourseId, setCurrentEditedCourseId] = useState(null);

  async function deleteCourse(courseId) {
    const response = await deleteCourseService(courseId);
    if (response?.success) {
      setInstructorCoursesList(prev => 
        prev.filter(course => course._id !== courseId)
      );
    }
    return response;
  }

  function updateCourseInList(courseId, updatedData) {
    setInstructorCoursesList(prev => 
      prev.map(course => 
        course._id === courseId 
          ? { ...course, ...updatedData }
          : course
      )
    );
  }

  return (
    <InstructorContext.Provider
      value={{
        courseLandingFormData,
        setCourseLandingFormData,
        courseCurriculumFormData,
        setCourseCurriculumFormData,
        mediaUploadProgress,
        setMediaUploadProgress,
        mediaUploadProgressPercentage,
        setMediaUploadProgressPercentage,
        instructorCoursesList,
        setInstructorCoursesList,
        currentEditedCourseId,
        setCurrentEditedCourseId,
        deleteCourse,
        updateCourseInList,
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
}
