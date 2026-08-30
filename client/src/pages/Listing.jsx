import React, { useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext";
import Item from "../components/Item";
import { dummyProperties } from "../assets/data";
import { useSearchParams } from "react-router-dom";

const Listing = () => {
  const { properties, searchQuery } = useAppContext();

  const [selectedFilters, setSelectedFilters] = useState({
    propertyType: [],
    priceRange: [],
  });

  const [selectedSort, setSelectedSort] = useState("Relevant");

  const [searchParams] = useSearchParams();

  const heroDestination = (searchParams.get("destination") || "")
    .toLowerCase()
    .trim();

  // Use API properties if available.
  // Otherwise use the dummy properties from data.js.
  const allProperties =
    properties && properties.length > 0 ? properties : dummyProperties;

  const sortOptions = ["Relevant", "Low to High", "High to Low"];

  const propertyTypes = [
    "House",
    "Apartment",
    "Villa",
    "Penthouse",
    "Townhouse",
    "Commercial",
    "Land Plot",
  ];

  const priceRange = [
    "0 to 10000",
    "10000 to 20000",
    "20000 to 40000",
    "40000 to 80000",
    "80000 to 120000",
  ];

  // Toggle filters
  const handleFilterChange = (checked, value, type) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: checked
        ? [...prev[type], value]
        : prev[type].filter((item) => item !== value),
    }));
  };

  // Sorting
  const sortProperties = (a, b) => {
    if (selectedSort === "Low to High") {
      return a.price.sale - b.price.sale;
    }

    if (selectedSort === "High to Low") {
      return b.price.sale - a.price.sale;
    }

    return 0;
  };

  // Price filter
  const matchesPrice = (property) => {
    if (selectedFilters.priceRange.length === 0) {
      return true;
    }

    return selectedFilters.priceRange.some((range) => {
      const [min, max] = range.split(" to ").map(Number);

      return (
        property.price.sale >= min &&
        property.price.sale <= max
      );
    });
  };

  // Property type filter
  const matchesType = (property) => {
    if (selectedFilters.propertyType.length === 0) {
      return true;
    }

    return selectedFilters.propertyType.includes(
      property.propertyType
    );
  };

  // Header search filter
  const matchesSearch = (property) => {
    if (!searchQuery) {
      return true;
    }

    const query = searchQuery.toLowerCase().trim();

    return (
      (property.title || "").toLowerCase().includes(query) ||
      (property.city || "").toLowerCase().includes(query) ||
      (property.country || "").toLowerCase().includes(query)
    );
  };

  // Hero destination filter
  const matchesHeroDestination = (property) => {
    if (!heroDestination) {
      return true;
    }

    return (property.city || "")
      .toLowerCase()
      .includes(heroDestination);
  };

  // Final filtered properties
  const filteredProperties = useMemo(() => {
    return [...allProperties]
      .filter(
        (property) =>
          matchesType(property) &&
          matchesPrice(property) &&
          matchesSearch(property) &&
          matchesHeroDestination(property)
      )
      .sort(sortProperties);
  }, [
    allProperties,
    selectedFilters,
    selectedSort,
    searchQuery,
    heroDestination,
  ]);

  return (
    <div className="bg-gradient-to-r from-[#fffbee] to-white py-16 pt-28">
      <div className="max-padd-container flex flex-col sm:flex-row gap-8 mb-16">

        {/* LEFT SIDE - FILTERS */}
        <div className="bg-secondary/10 ring-1 ring-slate-900/5 p-4 sm:min-w-60 sm:h-[600px] rounded-xl">

          {/* Sort By */}
          <div className="py-3 mt-4">
            <h5 className="h5 mb-3">
              Sort By
            </h5>

            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-secondary/10 border border-slate-900/10 outline-none text-gray-30 medium-14 h-8 w-full rounded px-2"
            >
              {sortOptions.map((sort) => (
                <option key={sort} value={sort}>
                  {sort}
                </option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div className="py-3 mt-4">
            <h5 className="h5 mb-4">
              Property Type
            </h5>

            {propertyTypes.map((type) => (
              <label
                key={type}
                className="flex gap-2 medium-14"
              >
                <input
                  type="checkbox"
                  checked={selectedFilters.propertyType.includes(type)}
                  onChange={(e) =>
                    handleFilterChange(
                      e.target.checked,
                      type,
                      "propertyType"
                    )
                  }
                />

                {type}
              </label>
            ))}
          </div>

          {/* Price Range */}
          <div className="py-3 mt-2">
            <h5 className="h5 mb-4">
              Price Range
            </h5>

            {priceRange.map((price) => (
              <label
                key={price}
                className="flex gap-2 medium-14"
              >
                <input
                  type="checkbox"
                  checked={selectedFilters.priceRange.includes(price)}
                  onChange={(e) =>
                    handleFilterChange(
                      e.target.checked,
                      price,
                      "priceRange"
                    )
                  }
                />

                ${price}
              </label>
            ))}
          </div>

        </div>

        {/* RIGHT SIDE - PROPERTIES */}
        <div className="flex-1 min-h-[97vh] rounded-xl">

          {filteredProperties.length > 0 ? (
            <>
              {/* Result count */}
              <div className="mb-5">
                <p className="text-gray-500 medium-14">
                  Showing{" "}
                  <span className="font-bold text-gray-800">
                    {filteredProperties.length}
                  </span>{" "}
                  properties
                </p>
              </div>

              {/* Property Grid */}
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {filteredProperties.map((property) => (
                  <Item
                    key={property._id}
                    property={property}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 mt-20">
              <h3 className="text-xl font-semibold mb-2">
                No matches found
              </h3>

              <p className="text-sm">
                Try changing your filters or search location.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Listing;