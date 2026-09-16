"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Card from "@/components/common/Card";
import { getVisitorDepartments } from "@/services/visitorService";
import {
  FaStethoscope,
  FaHeart,
  FaBrain,
  FaLungs,
  FaLeaf,
  FaTooth,
  FaSyringe,
  FaPuzzlePiece,
  FaMagic,
  FaHandHoldingHeart,
  FaClinicMedical,
  FaBaby,
  FaVenus,
  FaEye,
  FaBone,
  FaCapsules,
  FaMicroscope,
} from "react-icons/fa";

// Helper to determine the best icon based on specialty/department name
function getSpecialtyIcon(name = "") {
  const lower = name.toLowerCase();

  if (lower.includes("cardio") || lower.includes("heart")) return FaHeart;
  if (lower.includes("neuro") || lower.includes("brain")) return FaBrain;
  if (lower.includes("pulmo") || lower.includes("lung") || lower.includes("respirat")) return FaLungs;
  if (lower.includes("derma") || lower.includes("skin") || lower.includes("nail") || lower.includes("hair")) return FaMagic;
  if (lower.includes("dent") || lower.includes("tooth") || lower.includes("teeth") || lower.includes("oral")) return FaTooth;
  if (lower.includes("physio") || lower.includes("rehab")) return FaHandHoldingHeart;
  if (lower.includes("psych") || lower.includes("mental") || lower.includes("stress")) return FaPuzzlePiece;
  if (lower.includes("surg") || lower.includes("operation")) return FaSyringe;
  if (lower.includes("ortho") || lower.includes("bone") || lower.includes("joint")) return FaBone;
  if (lower.includes("pediatric") || lower.includes("child") || lower.includes("baby")) return FaBaby;
  if (lower.includes("gynec") || lower.includes("obstetric") || lower.includes("women")) return FaVenus;
  if (lower.includes("ophthal") || lower.includes("eye") || lower.includes("vision")) return FaEye;
  if (lower.includes("ent") || lower.includes("ear") || lower.includes("throat")) return FaStethoscope;
  if (lower.includes("pharm") || lower.includes("medicin")) return FaCapsules;
  if (lower.includes("radio") || lower.includes("patho") || lower.includes("lab")) return FaMicroscope;
  if (lower.includes("well") || lower.includes("ayurved") || lower.includes("homeo") || lower.includes("diet") || lower.includes("nutri")) return FaLeaf;

  return FaStethoscope;
}

export default function Specialties() {
  const [activeCategory, setActiveCategory] = useState("All Specialties");
  const [specialtiesList, setSpecialtiesList] = useState([]);
  const [categoryPills, setCategoryPills] = useState([{ name: "All Specialties", id: "all" }]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDynamicSpecialties() {
      try {
        setLoading(true);
        const res = await getVisitorDepartments({ limit: 100 });

        if (isMounted && res && res.success && Array.isArray(res.data)) {
          const allDepts = res.data;

          // Extract only parent categories from DB
          const dbParentCategories = allDepts
            .filter((dept) => Boolean(dept.is_parent))
            .map((dept) => ({
              id: dept.id,
              name: dept.name,
              icon: getSpecialtyIcon(dept.name),
            }));

          // Set dynamic pills
          setCategoryPills([
            { id: "all", name: "All Specialties", icon: null },
            ...dbParentCategories,
          ]);

          // Display non-parent departments (sub-departments / independent specialties)
          const childDepts = allDepts.filter((dept) => !dept.is_parent);
          // If no child departments exist yet, show all departments so list is not empty
          const displayList = childDepts.length > 0 ? childDepts : allDepts;

          const formatted = displayList.map((dept) => {
            const name = dept.name || "";
            const desc = dept.description && dept.description.trim().length > 0
              ? dept.description
              : `Comprehensive care and specialist consultation for ${name}.`;

            return {
              id: dept.id,
              title: name,
              description: desc,
              icon: getSpecialtyIcon(name),
              iconWrapperClass: "bg-specialty-green",
              parent_id: dept.parent_id,
              parent_name: dept.parent?.name || null,
            };
          });

          setSpecialtiesList(formatted);
        } else if (isMounted) {
          setSpecialtiesList([]);
        }
      } catch (err) {
        console.error("Failed to fetch dynamic specialties:", err);
        if (isMounted) {
          setSpecialtiesList([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDynamicSpecialties();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter specialties based on active category selection
  const filteredSpecialties = activeCategory === "All Specialties"
    ? specialtiesList
    : specialtiesList.filter((item) => {
        if (!item.parent_name && !item.parent_id) {
          return false;
        }
        return (
          (item.parent_name && item.parent_name.toLowerCase() === activeCategory.toLowerCase()) ||
          (item.parent_id && categoryPills.find(p => p.name === activeCategory && p.id === item.parent_id))
        );
      });

  const totalSpecialtiesCount = specialtiesList.length || 30;

  return (
    <div className="specialties-section">
      <div className="container py-4">
        {/* Top Header */}
        <div className="text-center mb-5">
          <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
            <div className="specialties-header-line"></div>
            <span className="text-uppercase fw-bold small text-brand-green specialties-subheading">
              ALL YOU NEED, ALL IN ONE PLACE
            </span>
            <div className="specialties-header-line"></div>
          </div>
          <h2 className="display-5 fw-bold text-dark mb-3 specialties-title">
            {totalSpecialtiesCount >= 10 ? `${totalSpecialtiesCount}+` : totalSpecialtiesCount} specialties. <span className="text-brand-green">One booking flow.</span>
          </h2>
          <p className="text-muted col-lg-6 mx-auto specialties-desc">
            Whatever you need — from a general physician to a neurosurgeon, a homeopath to a dietitian — find them in seconds. All verified, all across India.
          </p>
        </div>

        {/* Category Selection Pills */}
        <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
          {categoryPills.map((cat, idx) => {
            const isActive = activeCategory === cat.name;
            return (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat.name)}
                className={`btn d-flex align-items-center px-4 py-2 rounded-pill specialties-pill ${
                  isActive ? "specialties-pill-active" : "specialties-pill-inactive"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Specialties Grid */}
        {loading ? (
          <div className="row row-cols-1 row-cols-md-3 row-cols-lg-5 g-4 justify-content-center">
            {[1, 2, 3, 4, 5].map((skeletonId) => (
              <div key={skeletonId} className="col">
                <div className="card common-card border-0 shadow-sm h-100 p-3 specialties-skeleton-card">
                  <div className="spinner-grow text-success spinner-grow-sm mb-3" role="status"></div>
                  <div className="placeholder-glow mb-2">
                    <span className="placeholder col-8 rounded"></span>
                  </div>
                  <div className="placeholder-glow">
                    <span className="placeholder col-12 rounded mb-1"></span>
                    <span className="placeholder col-10 rounded"></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredSpecialties.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p className="mb-0">No specialties found under &quot;{activeCategory}&quot;.</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-3 row-cols-lg-5 g-4 justify-content-center">
            {filteredSpecialties.map((specialty, idx) => (
              <div key={specialty.id || idx} className="col">
                <Card
                  title={specialty.title}
                  description={specialty.description}
                  icon={specialty.icon}
                  iconWrapperClass={specialty.iconWrapperClass}
                  actionType="arrow"
                  link={`/finddoctor?specialty=${encodeURIComponent(specialty.title)}`}
                />
              </div>
            ))}
          </div>
        )}

        {/* Everything works together Banner */}
        <div className="specialties-banner mt-5 d-flex flex-column flex-md-row align-items-center justify-content-between p-4 rounded-4 specialties-promo-banner">
          <div className="d-flex flex-column flex-sm-row align-items-center align-items-sm-start gap-3 mb-3 mb-md-0 text-center text-sm-start">
            <div className="banner-icon-wrapper p-3 bg-white rounded-3 d-flex align-items-center justify-content-center flex-shrink-0 specialties-banner-icon">
              <FaClinicMedical size={28} />
            </div>
            <div>
              <h5 className="fw-bold mb-1 text-dark specialties-banner-title">
                Everything works together
              </h5>
              <p className="text-muted mb-0 specialties-banner-desc">
                All specialties are connected under one seamless booking flow — find, compare and book verified doctors across India in seconds.
              </p>
            </div>
          </div>
          <div className="d-flex flex-wrap gap-3 align-items-center justify-content-center flex-shrink-0">
            <Link
              href="/specialties"
              className="btn px-4 py-2 rounded-pill fw-semibold text-white text-decoration-none specialties-banner-btn-primary"
            >
              Explore all specialties &rarr;
            </Link>
            <Link
              href="/finddoctor"
              className="btn px-4 py-2 rounded-pill fw-semibold text-decoration-none specialties-banner-btn-outline"
            >
              Browse by city
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
