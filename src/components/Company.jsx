import React from 'react';
// import hp_cpy_image from '../images/hp_cpy_image.jpg';
import { useNavigate } from 'react-router-dom';
import waltonbd_logo from '../images/waltonbd_logo.jpg'

const Company = () => {
    const navigate = useNavigate();
    return (
        <div className='bg-red-500 h-full p-4'>
            {/* [#2e9afe] */}
            <div className="options text-center text-white text-lg pt-2 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => navigate('/home')} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 absolute left-2  storke-white top-5 cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                Company Profile
            </div>

            <div className="hp_company mt-10">
                <img src={waltonbd_logo} alt="hp" className='sm:w-3/6 md:w-2/6 mx-auto' />
            </div>

            <div className=" cpy_info sm:w-4/5 lg:w-3/4 mx-auto mt-5">
                
                {/*  [#2e9afe]*/}
                <div className='shadow-lg text-center bg-white h-10 flex justify-center items-center text-lg font-medium rounded-lg shadow-red-300 text-red-600'>Company Profile</div>
            </div>

            <div className="part sm:w-4/5 lg:w-3/4 mx-auto text-white mt-4">
                <div className="heading font-bold mb-1">Walton</div>
                <hr />
                <div className="data text-sm mt-2">Walton is the latest multinational electrical, electronics, automobiles and other appliances brand with one of the largest well equipped R & I facilities in the world carried out its production through different subsidiaries under the banner of Walton group headquarters in Bangladesh. Today, Walton has a workforce of more than 30000+ in total 22 production bases under 700+ acres of factory area. The capacity of yearly production is 10 million units based on the market demands. Walton is the giant professional manufacturer in the relevant industry and has gained high reputation in terms of its unbeatable capability for producing Electrical and Electronics goods in the most competitive way in aspect of quality, cost, design and innovation.
                </div>
            </div>

            <div className="part sm:w-4/5 lg:w-3/4 mx-auto text-white mt-4">
                <div className="heading font-bold mb-1">Our History</div>
                <hr />
                <div className="data text-sm mt-2">
                Business started since 1977 and early 2008 WHIPLC started manufacturing of Refrigerator, Freezer, Air Conditioner, Compressor and now onward expanding its operation in Television, Home & Electrical Appliances. Walton & Marcel have become the most trusted and prestigious Brand in the E&E industry in Bangladesh through its strong manufacturing base, quality products, competitive price, extensive market coverage and last but not the least, the prompt after sales services. As a result, within a very short period of time, both the Brands have captured substantial market share and positioned itself as the most dominant performer in the E&E sector in Bangladesh. Product portfolio of WHIPLC includes Refrigerator (Frost & Non-Frost), Freezer, Air Conditioner, Compressor and Television.
                </div>
            </div>

            <div className="part sm:w-4/5 lg:w-3/4 mx-auto text-white mt-4">
                <div className="heading font-bold mb-1">Our Production Facilities</div>
                <hr />
                <div className="data text-sm mt-2">The Manufacturing Plant & Headquarters of WHIPLC is located at Chandra, Kaliakoir, Gazipur, Bangladesh. The plant is treated as one of the sophisticated manufacturing plants in Bangladesh as well as in South Asia. Walton innovates to build a more advanced, sustainable and environment friendly society through the combination of sophisticated technologies and expertise. The manufacturing plant of WHIPLC is approx. 5,000,000 sft. of working space consisting of 19 Buildings and Shades.
                </div>
            </div>

            <div className="part sm:w-4/5 lg:w-3/4 mx-auto text-white mt-4">
                <div className="heading font-bold mb-1">Awards</div>
                <hr />
                <div className="data text-sm mt-2">Walton is the No. 1 Manufacturer and Exporter of Refrigerator, Air Conditioner, LED TV, Mobile Phone, Walton has achieved many international & national awards and recognitions like some recent prestigious and best business awards are: The Golden Globe Tiger Award 2015 in the category of Excellence & Leadership Brand, DHL-Daily Star Bangladesh 15th Business Award 2014 for Best Enterprise in Bangladesh, Asia Best Employer Brand Awards in 2015, Six times 1st Prize for Highest VAT Payer at DITF-2015, 2014, 2013, 2012, 2011 & 2010 respectively, Second Prize for Premier Pavilion Category at DITF-2015, Best Refrigerator Brand Award-2014, Best Television Brand Award-2014, Best Local Brand Award-2014, 1st Prize for Premier Pavilion Category at DITF-2014, The Global Brand excellence Award in 2014 for brand excellence in consumer electronics, 1st Prize for Premier Pavilion Category at DITF-2013, Best Sponsor Award-2012, Creative Media Ltd. BABISAS Award-2012, Best Brand (Refrigerator) Award-2011, 2nd Prize for Premier Pavilion Category at DITF-2011, 2nd Prize for Premier Pavilion Category at DITF-2010, 1st Prize for Premier Pavilion Category at DITF-2009, 1st Prize for Premier Pavilion Category at CITF-2005.
                </div>
            </div>

            <div className="part  sm:w-4/5 lg:w-3/4 mx-auto text-white mt-4">
                <div className="heading font-bold mb-1">Our Vision</div>
                <hr />
                <div className="data text-sm mt-2">Along the way, Walton has earned domestic and global recognition for its experience and proven track record in a variety of electronics fields. Walton is the pioneer of developing state of the art designs and modern technology having leading market share specializing in Multi-Stored Refrigerators, Freezers, Air Conditioners, LED/ LCD televisions, Motorcycles, Smart Phones and Home Appliances.Walton is working on carrying the flag of red and green into the global market presence from the present 40 countries to more than 200 countries to dominate Go Global and the top five Electronics Brand of the Globe within 2030.</div>
                <br />
                <br />
            </div>

        </div>
    )
}

export default Company