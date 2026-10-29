import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Layout from "./layouts/Layout.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import ManagingCommittee from "./pages/ManagingCommittee.jsx";
import SalaryDetails from "./pages/SalaryDetails.jsx";
import SchoolDataSheet from "./pages/SchoolDataSheet.jsx";
import Infrastructure from "./pages/Infrastructure.jsx";
import Academics from "./pages/Academics.jsx";
import Admissions from "./pages/Admissions.jsx";
import Gallery from "./pages/Gallery.jsx";
import Achievements from "./pages/Achievements.jsx";
import LeavingCertificate from "./pages/LeavingCertificate.jsx";
import BooksList from "./pages/BooksList.jsx";
import Disclosure from "./pages/Disclosure.jsx";
import News from "./pages/News.jsx";
import Calendar from "./pages/Calendar.jsx";
import Contact from "./pages/Contact.jsx";
import FeePayment from "./pages/FeePayment.jsx";
import NotFound from "./pages/NotFound.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="managing-committee" element={<ManagingCommittee />} />
          <Route path="salary-details" element={<SalaryDetails />} />
          <Route path="school-data-sheet" element={<SchoolDataSheet />} />
          <Route path="infrastructure" element={<Infrastructure />} />
          <Route path="academics" element={<Academics />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="transfer-certificate" element={<LeavingCertificate />} />
          <Route path="books-list" element={<BooksList />} />
          <Route path="mandatory-public-disclosure" element={<Disclosure />} />
          <Route path="news" element={<News />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="contact" element={<Contact />} />
          <Route path="announcements" element={<Navigate to="/news" replace />} />
          <Route path="pay-fees" element={<FeePayment />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
