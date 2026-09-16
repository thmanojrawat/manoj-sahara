import React, { useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext";
import Item from "../components/Item";
import { useSearchParams, Link } from "react-router-dom";
import {
  MapPin,
  ArrowUpDown,
  Building2,
  BedDouble,
  IndianRupee,
  SlidersHorizontal,
  X,
} from "lucide-react";

const PROPERTY_TYPES = ["Apartment", "Villa", "House", "Commercial", "Plot", "Penthouse"];
const BHK_OPTIONS = ["1", "2", "3", "4", "5"];
const SORT_OPTIONS = ["Relevant", "Price: Low to High", "Price: High to Low"];

const PRICE_RANGES = [
  { label: "Up to ₹50 Lac", min: 0, max: 5000000 },
  { label: "₹50L – ₹1 Cr", min: 5000000, max: 10000000 },
  { label: "₹1 Cr – ₹2 Cr", min: 10000000, max: 20000000 },
  { label: "₹2 Cr – ₹5 Cr", min: 20000000, max: 50000000 },
  { label: "Above ₹5 Cr", min: 50000000, max: Infinity },
];

const Listing = () => {
  const { properties, propertiesLoading, propertiesError } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters from URL
  const urlLocality = searchParams.get("locality") || searchParams.get("destination") || "";
  const urlPropertyType = searchParams.get("propertyType") || "";
  const urlBhk = searchParams.get("bhk") || "";
  const urlMinPrice = searchParams.get("minPrice") || "";
  const urlMaxPrice = searchParams.get("maxPrice") || "";

  // Local filter state (initialized from URL)
  const [selectedTypes, setSelectedTypes] = useState(() =>
    urlPropertyType ? [urlPropertyType] : []
  );
  const [selectedBhk, setSelectedBhk] = useState(() =>
    urlBhk ? [urlBhk.replace("plus", "+")] : []
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [sortBy, setSortBy] = useState("Relevant");
  const [localitySearch, setLocalitySearch] = useState(urlLocality);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const getPrice = (p) => p.price?.sale ?? p.price?.rent ?? p.price ?? 0;

  const filteredProperties = useMemo(() => {
    let result = [...properties];

    const locality = localitySearch.toLowerCase().trim();
    if (locality) {
      result = result.filter((p) =>
        (p.locality || "").toLowerCase().includes(locality) ||
        (p.city || "").toLowerCase().includes(locality) ||
        (p.address || "").toLowerCase().includes(locality) ||
        (p.title || "").toLowerCase().includes(locality)
      );
    }

    if (selectedTypes.length > 0) {
      result = result.filter((p) => selectedTypes.includes(p.propertyType));
    }

    if (selectedBhk.length > 0) {
      result = result.filter((p) => {
        const beds = String(p.facilities?.bedrooms || "");
        return selectedBhk.some((b) => {
          if (b.includes("+")) return p.facilities?.bedrooms >= parseInt(b);
          return beds === b;
        });
      });
    }

    if (selectedPriceRange) {
      result = result.filter((p) => {
        const price = getPrice(p);
        return price >= selectedPriceRange.min && price <= selectedPriceRange.max;
      });
    }

    if (urlMinPrice) result = result.filter((p) => getPrice(p) >= Number(urlMinPrice));
    if (urlMaxPrice) result = result.filter((p) => getPrice(p) <= Number(urlMaxPrice));

    if (sortBy === "Price: Low to High") result.sort((a, b) => getPrice(a) - getPrice(b));
    if (sortBy === "Price: High to Low") result.sort((a, b) => getPrice(b) - getPrice(a));

    return result;
  }, [properties, localitySearch, selectedTypes, selectedBhk, selectedPriceRange, sortBy, urlMinPrice, urlMaxPrice]);

  const toggleFilter = (arr, setArr, value) => {
    setArr((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedBhk([]);
    setSelectedPriceRange(null);
    setLocalitySearch("");
    setSortBy("Relevant");
    setSearchParams({});
  };

  const activeFilterCount =
    selectedTypes.length + selectedBhk.length + (selectedPriceRange ? 1 : 0) + (localitySearch ? 1 : 0);
  const hasActiveFilters = activeFilterCount > 0;

  const headingText = localitySearch ? `Properties in ${localitySearch}` : "All Properties";

  // Individual chip removers, so each active filter can be cleared on its own
  const removeChip = (type, value) => {
    if (type === "locality") setLocalitySearch("");
    if (type === "type") toggleFilter(selectedTypes, setSelectedTypes, value);
    if (type === "bhk") toggleFilter(selectedBhk, setSelectedBhk, value);
    if (type === "price") setSelectedPriceRange(null);
  };

  const activeChips = [
    localitySearch && { type: "locality", label: localitySearch },
    ...selectedTypes.map((t) => ({ type: "type", value: t, label: t })),
    ...selectedBhk.map((b) => ({ type: "bhk", value: b, label: `${b} BHK` })),
    selectedPriceRange && { type: "price", label: selectedPriceRange.label },
  ].filter(Boolean);

  if (propertiesLoading) {
    return (
      <div className="bg-gradient-to-r from-[#fffbee] to-white py-16 pt-28 min-h-screen">
        <div className="max-padd-container">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl ring-1 ring-slate-900/5 overflow-hidden animate-pulse">
                <div className="h-52 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (propertiesError) {
    return (
      <div className="bg-gradient-to-r from-[#fffbee] to-white py-16 pt-28 min-h-screen">
        <div className="max-padd-container text-center py-20">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Unable to load properties</h3>
          <p className="text-gray-500 mb-6">{propertiesError}</p>
          <button onClick={() => window.location.reload()} className="btn-dark px-6 py-2 rounded-lg">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Shared filter panel markup — rendered both in the desktop sidebar and
  // the mobile slide-over so the two never drift out of sync.
  const FilterPanel = (
    <>
      <div className="py-2 mb-2">
        <h5 className="h5 mb-3 flex items-center gap-2"><MapPin size={16} className="text-amber-600" /> Location</h5>
        <input
          type="text"
          value={localitySearch}
          onChange={(e) => setLocalitySearch(e.target.value)}
          placeholder="e.g. New Town, Alipore..."
          className="w-full border border-slate-900/10 rounded-md px-3 py-2 text-sm outline-none bg-white"
        />
      </div>

      <div className="py-4 border-t border-slate-900/10">
        <h5 className="h5 mb-3 flex items-center gap-2"><ArrowUpDown size={16} className="text-amber-600" /> Sort By</h5>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-white border border-slate-900/10 outline-none text-gray-600 text-sm h-9 w-full rounded-md px-2"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="py-4 border-t border-slate-900/10">
        <h5 className="h5 mb-4 flex items-center gap-2"><Building2 size={16} className="text-amber-600" /> Property Type</h5>
        <div className="flex flex-col gap-2.5">
          {PROPERTY_TYPES.map((type) => (
            <label key={type} className="flex gap-2 medium-14 cursor-pointer text-gray-700">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => toggleFilter(selectedTypes, setSelectedTypes, type)}
                className="accent-amber-500"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      <div className="py-4 border-t border-slate-900/10">
        <h5 className="h5 mb-4 flex items-center gap-2"><BedDouble size={16} className="text-amber-600" /> BHK</h5>
        <div className="flex flex-wrap gap-2">
          {BHK_OPTIONS.map((b) => (
            <button
              key={b}
              onClick={() => toggleFilter(selectedBhk, setSelectedBhk, b)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                selectedBhk.includes(b)
                  ? "bg-amber-500 text-white border-amber-500"
                  : "border-slate-300 text-gray-600 hover:border-amber-400"
              }`}
            >
              {b} BHK
            </button>
          ))}
        </div>
      </div>

      <div className="py-4 border-t border-slate-900/10">
        <h5 className="h5 mb-4 flex items-center gap-2"><IndianRupee size={16} className="text-amber-600" /> Budget</h5>
        <div className="flex flex-col gap-2.5">
          {PRICE_RANGES.map((range) => (
            <label key={range.label} className="flex gap-2 medium-14 cursor-pointer text-gray-700">
              <input
                type="radio"
                name="priceRange"
                checked={selectedPriceRange?.label === range.label}
                onChange={() => setSelectedPriceRange(range)}
                className="accent-amber-500"
              />
              {range.label}
            </label>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="mt-5 w-full border border-slate-900/20 rounded-md py-2 text-sm text-gray-600 hover:bg-white transition-colors"
        >
          Clear All Filters
        </button>
      )}
    </>
  );

  return (
    <div className="bg-gradient-to-r from-[#fffbee] to-white py-10 pt-28 min-h-screen">
      <div className="max-padd-container">
        {/* Heading row + mobile filter trigger */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="h3 text-gray-900">{headingText}</h2>
            <p className="text-gray-500 text-sm mt-1">
              <span className="font-bold text-gray-800">{filteredProperties.length}</span>{" "}
              propert{filteredProperties.length === 1 ? "y" : "ies"} found
            </p>
          </div>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden relative btn-outline flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm shrink-0"
          >
            <SlidersHorizontal size={16} /> Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-amber-500 text-white text-[11px] font-semibold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {activeChips.map((chip, i) => (
              <span
                key={`${chip.type}-${chip.value ?? chip.label}-${i}`}
                className="flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full pl-3 pr-2 py-1 text-xs font-medium"
              >
                {chip.label}
                <button onClick={() => removeChip(chip.type, chip.value)} className="hover:text-amber-900">
                  <X size={13} />
                </button>
              </span>
            ))}
            <button onClick={clearAllFilters} className="text-xs font-medium text-gray-500 hover:text-gray-800 underline">
              Clear all
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block bg-secondary/10 ring-1 ring-slate-900/5 p-5 lg:w-72 shrink-0 h-fit rounded-xl lg:sticky lg:top-24">
            {FilterPanel}
          </aside>

          {/* Mobile slide-over filters */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
              <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-white overflow-y-auto p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                  <button onClick={() => setMobileFiltersOpen(false)} className="p-1.5 rounded-full hover:bg-slate-100">
                    <X size={20} />
                  </button>
                </div>
                {FilterPanel}
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="btn-dark w-full mt-5 py-2.5 rounded-lg"
                >
                  Show {filteredProperties.length} results
                </button>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 min-h-[60vh] rounded-xl">
            {filteredProperties.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProperties.map((property) => (
                  <Item key={property._id || property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No properties found{localitySearch ? ` in "${localitySearch}"` : ""}
                </h3>
                <p className="text-gray-500 mb-6 text-sm">
                  Try adjusting your filters or exploring other areas.
                </p>
                <div className="flex justify-center gap-3">
                  {hasActiveFilters && (
                    <button onClick={clearAllFilters} className="btn-outline px-5 py-2 rounded-full text-sm">
                      Clear Filters
                    </button>
                  )}
                  <Link to="/listing" onClick={clearAllFilters} className="btn-dark px-5 py-2 rounded-full text-sm">
                    Explore Kolkata
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listing;
