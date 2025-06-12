import { FaRegCopyright } from "react-icons/fa";

function Footer() {
  return (
    <div className='text-center'>
        <FaRegCopyright/> {new Date().getFullYear()} Play Heaven Store
      
    </div>
  )
}

export default Footer