import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/data'
import { useAppContext } from '../context/AppContext'

const Item = ({property}) => {
  const {currency} = useAppContext()
  const agencyPhone = property.agency?.contact
  
  return (
    <div className='group relative overflow-hidden rounded-lg bg-white ring-1 ring-slate-900/5 transition-transform duration-300 hover:z-10 hover:scale-[1.04] focus-within:z-10 focus-within:scale-[1.04]'>
      <Link to={'/listing/' + property._id}
      className='block'>
        {/* Image */}
        <div className='relative'>
          <img
            src={property.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'}
            alt={property.title}
            className='h-[13rem] w-full aspect-square object-cover rounded-t-xl'
          />
        </div>
        {/* Info */}
        <div className="p-3">
          <div className="flexBetween">
              <h5 className="bold-16 my-1">{property.propertyType || "Apartment"}</h5>
              <div className='bold-15 text-secondary'>
                {currency}{Number(property.price?.sale || property.price || 0).toLocaleString()}
                {property.price?.rent && (
                  <span className='text-xs font-normal text-slate-500 ml-1'>
                    | {currency}{Number(property.price.rent).toLocaleString()}/mo
                  </span>
                )}
              </div>
          </div>
          <h4 className='h4 line-clamp-1'>{property.title}</h4>
          <div className="flexCenter gap-4 py-2">
              <p className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'>
                  <img src={assets.bed} alt="facilitiesIcon" width={21}/>
                  {property.facilities?.bedrooms ?? 3}
              </p>
              <p className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'>
                  <img src={assets.bath} alt="facilitiesIcon" width={21}/>
                  {property.facilities?.bathrooms ?? 2}
              </p>
              <p className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'>
                  <img src={assets.car} alt="facilitiesIcon" width={21}/>
                  {property.facilities?.garages ?? 1}
              </p>
              <p className='flexCenter gap-x-2 pr-4 font-[500]'>
                  <img src={assets.ruler} alt="facilitiesIcon" width={21}/>
                  {property.area || 1200}
              </p>
          </div>
          <p className="pt-2 mb-4 line-clamp-2">{property.description}</p>
        </div>
      </Link>
      <div className='grid grid-rows-[0fr] px-3 transition-[grid-template-rows] duration-200 group-hover:grid-rows-[1fr] group-focus-within:grid-rows-[1fr]'>
        <div className='min-h-0 overflow-hidden'>
          <div className='mb-3 flex gap-2'>
            <Link
              to={'/listing/' + property._id}
              className='group/explore relative flex h-10 flex-1 items-center justify-center overflow-hidden rounded-full bg-[#d99a35] px-10 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#c88624]'
            >
              Explore
              <span className='absolute left-1 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#d99a35] transition-all duration-500 group-hover/explore:left-[calc(100%-2.25rem)]'>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='h-4 w-4'>
                  <path d="M5 12h14" />
                  <path d="m13 6 6 6-6 6" />
                </svg>
              </span>
            </Link>
            {agencyPhone && (
              <a
                href={`tel:${agencyPhone}`}
                className='flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#d99a35] px-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#c88624]'
              >
                Call Now
                <span className='flex h-5 w-5 items-center justify-center rounded-full bg-white'>
                  <img src={assets.phone} alt="" className='h-3.5 w-3.5' />
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Item
