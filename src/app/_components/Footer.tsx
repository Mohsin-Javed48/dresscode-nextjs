import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-black py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-row md:flex-row ">
        <div className="mb-6 md:mb-0 ">
          <div className="bg-black text-white p-4 text-center md:text-left">
            <h2 className="text-2xl font-bold">
              STAY UP TO DATE ABOUT OUR LATEST OFFERS
            </h2>
            <div className="mt-4 flex flex-col md:flex-row items-center">
              <input
                type="email"
                placeholder="Enter your email address"
                className="p-2 border border-gray-300 rounded-l-md w-full md:w-auto"
              />
              <button className="bg-white text-black p-2 rounded-r-md mt-2 md:mt-0 md:ml-2">
                Subscribe to Newsletter
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between w-full md:w-auto mt-6 md:mt-0">
          <div className="mb-6 md:mb-0 md:mr-12">
            <h3 className="font-bold mb-2">SHOP.CO</h3>
            <p className="text-sm">
              We have clothes that suits your style and which you’re proud to
              wear. From women to men.
            </p>
            <div className="flex space-x-2 mt-2">
              <a href="#">
                {/* <Image src="/twitter.svg" alt="Twitter" className="w-5 h-5" /> */}
              </a>
              <a href="#">
                {/* <Image src="/facebook.svg" alt="Facebook" className="w-5 h-5" /> */}
              </a>
              <a href="#">
                {/* <Image
                  src="/instagram.svg"
                  alt="Instagram"
                  className="w-5 h-5"
                /> */}
              </a>
            </div>
          </div>
          <div className="mb-6 md:mb-0 md:mr-12">
            <h3 className="font-bold mb-2">COMPANY</h3>
            <ul className="text-sm space-y-1">
              <li>
                <Link href="#">About</Link>
              </li>
              <li>
                <Link href="#">Features</Link>
              </li>
              <li>
                <Link href="#">Works</Link>
              </li>
              <li>
                <Link href="#">Career</Link>
              </li>
            </ul>
          </div>
          <div className="mb-6 md:mb-0 md:mr-12">
            <h3 className="font-bold mb-2">HELP</h3>
            <ul className="text-sm space-y-1">
              <li>
                <Link href="#">Customer Support</Link>
              </li>
              <li>
                <Link href="#">Delivery Details</Link>
              </li>
              <li>
                <Link href="#">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="#">Privacy Policy</Link>
              </li>
            </ul>
          </div>
          <div className="mb-6 md:mb-0 md:mr-12">
            <h3 className="font-bold mb-2">FAQ</h3>
            <ul className="text-sm space-y-1">
              <li>
                <Link href="#">Account</Link>
              </li>
              <li>
                <Link href="#">Manage Deliveries</Link>
              </li>
              <li>
                <Link href="#">Orders</Link>
              </li>
              <li>
                <Link href="#">Payments</Link>
              </li>
            </ul>
          </div>
          <div className="mb-6 md:mb-0">
            <h3 className="font-bold mb-2">RESOURCES</h3>
            <ul className="text-sm space-y-1">
              <li>
                <Link href="#">Free eBooks</Link>
              </li>
              <li>
                <Link href="#">Development Tutorial</Link>
              </li>
              <li>
                <Link href="#">How to - Blog</Link>
              </li>
              <li>
                <Link href="#">Youtube Playlist</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 md:mt-0 flex flex-col items-center md:items-end">
          <div className="flex space-x-2 mb-2">
            {/* <Image src="/visa.svg" alt="Visa" className="w-10 h-6" />
            <Image
              src="/mastercard.svg"
              alt="Mastercard"
              className="w-10 h-6"
            />
            <Image src="/paypal.svg" alt="PayPal" className="w-10 h-6" />
            <Image src="/apple-pay.svg" alt="Apple Pay" className="w-10 h-6" /> */}
          </div>
          <p className="text-xs">Shop.co © 2000-2023. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}
