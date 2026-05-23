import api from "@/lib/api";

export const getColleges = async (_filters?: import("@/types/college").CollegeFilters) => {
  const res = await api.get("/colleges");
  // Backend returns: { data: College[], pagination: {...} }
  return res.data;
};


export const getFeaturedColleges = async () => {
  const { data } = await api.get("/colleges/featured");
  return data;
};



export const getCollegeById = async (id: number) => {
  const { data } = await api.get(`/colleges/${id}`);
  return data;
};

export const getLocations = async () => {
  const { data } = await api.get("/colleges/locations");
  return data;
};

export const getCourses = async () => {
  const { data } = await api.get("/colleges/courses");
  return data;
};

export const compareColleges = async (ids: number[]) => {
  const { data } = await api.get("/colleges/compare", {
    params: { ids: ids.join(",") },
  });

  return data;
};