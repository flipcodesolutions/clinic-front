import React from "react";
import Link from "next/link";
import { FaChevronRight, FaArrowRight } from "react-icons/fa6";

/**
 * Reusable Card component for services, specialties, and list displays.
 * 
 * @param {object} props
 * @param {string} props.title - Card title
 * @param {string} props.description - Card description
 * @param {React.ComponentType} [props.icon] - Icon class
 * @param {string} [props.iconWrapperClass] - Custom CSS class for icon background & color
 * @param {string} [props.link="/"] - Redirect url link path
 * @param {string} [props.linkText="Learn more"] - Custom link label text
 * @param {string} [props.actionType="arrow"] - Display action trigger mode ('link' | 'arrow' | 'none')
 * @param {string} [props.stepNumber] - Step overlay number (e.g. "01")
 * @param {string} [props.stepBgClass] - CSS class for the step badge background color
 * @param {string} [props.layout="vertical"] - Layout orientation ('vertical' | 'horizontal')
 */
export default function Card({
  title,
  description,
  icon: Icon,
  iconWrapperClass = "",
  link = "/",
  linkText = "Learn more",
  actionType = "arrow",
  stepNumber,
  stepBgClass = "",
  layout = "vertical"
}) {
  if (layout === "horizontal") {
    return (
      <div className="card common-card-horizontal h-100 position-relative">
        <div className="card-body common-card-horizontal-body d-flex align-items-center gap-3">
          {/* Icon Container */}
          {Icon && (
            <div className={`common-card-horizontal-icon-box d-flex align-items-center justify-content-center flex-shrink-0 ${iconWrapperClass}`}>
              {typeof Icon === "function" ? (
                <Icon size={18} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={Icon.src || Icon} alt={title} style={{ width: "24px", height: "24px", objectFit: "contain" }} />
              )}
            </div>
          )}

          {/* Title and Description */}
          <div>
            <h6 className="fw-bold text-dark mb-1 common-card-horizontal-title">
              {title}
            </h6>
            <p className="small mb-0 common-card-horizontal-desc">
              {description}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card common-card border-0 shadow-sm h-100 position-relative">
      {/* Optional Step Badge Overlay */}
      {stepNumber && (
        <div className={`common-card-step-badge rounded-circle text-white fw-bold d-flex align-items-center justify-content-center ${stepBgClass || "bg-success"}`}>
          {stepNumber}
        </div>
      )}

      <div className="card-body common-card-body d-flex flex-column h-100 justify-content-between">
        <div>
          {/* Icon Container */}
          {Icon && (
            <div className={`common-card-icon-box d-flex align-items-center justify-content-center mb-3 ${iconWrapperClass}`}>
              {typeof Icon === "function" ? (
                <Icon size={22} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={Icon.src || Icon} alt={title} style={{ width: "28px", height: "28px", objectFit: "contain" }} />
              )}
            </div>
          )}

          {/* Title */}
          <h5 className="fw-bold text-dark mb-2 common-card-title">
            {title}
          </h5>

          {/* Description */}
          <p className="small mb-0 common-card-desc">
            {description}
          </p>
        </div>

        {/* Action Bottom Section */}
        {actionType !== "none" && (
          <div className="mt-4">
            {actionType === "link" ? (
              <Link
                href={link}
                className="text-primary text-decoration-none fw-semibold small d-inline-flex align-items-center gap-1"
              >
                <span>{linkText}</span>
                <FaChevronRight className="fs-6" />
              </Link>
            ) : (
              <div className="d-flex justify-content-end">
                <Link
                  href={link}
                  className="common-card-circle-arrow text-decoration-none"
                >
                  <FaArrowRight size={13} />
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
