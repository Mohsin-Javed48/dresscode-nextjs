import React from "react";
import {
  Search,
  ShoppingCart,
  User,
  X,
  ChevronDown,
  Star,
  Users,
  Award,
  Heart,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
                ABOUT
                <br />
                DRESSCODE
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Celebrating the rich heritage of Pakistani design through
                contemporary fashion that speaks to your unique style and
                cultural pride.
              </p>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-pink-200 via-orange-200 to-yellow-200 rounded-2xl flex items-center justify-center">
                <div className="w-32 h-32 bg-white/30 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="lg:order-2">
              <h2 className="text-4xl font-bold text-black mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Founded with a passion for preserving and modernizing
                traditional Pakistani craftsmanship, DRESSCODE bridges the gap
                between heritage and contemporary fashion. Our journey began
                with a simple belief: that clothing should be more than just
                fabric—it should tell a story.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Every piece in our collection is meticulously handcrafted by
                skilled artisans who have inherited their craft through
                generations. We work directly with local communities, ensuring
                fair wages and preserving traditional techniques while creating
                modern designs that resonate with today&apos;s fashion-conscious
                consumers.
              </p>
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-black mb-2">200+</div>
                  <div className="text-sm text-gray-600">
                    International Brands
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-black mb-2">
                    2,000+
                  </div>
                  <div className="text-sm text-gray-600">
                    High Quality Products
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-black mb-2">
                    30,000+
                  </div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
              </div>
            </div>
            <div className="lg:order-1">
              <div className="w-full h-96 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 rounded-2xl flex items-center justify-center">
                <div className="w-32 h-32 bg-white/30 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              To create exceptional clothing that honors our cultural heritage
              while meeting the demands of modern lifestyle, all while
              supporting local artisans and sustainable practices.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl text-center shadow-sm">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-black mb-4">
                Authentic Craftsmanship
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Every piece is handcrafted by skilled artisans using traditional
                techniques passed down through generations, ensuring
                authenticity and quality.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl text-center shadow-sm">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-black mb-4">
                Community Impact
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We partner directly with local communities, providing fair wages
                and supporting the preservation of traditional Pakistani textile
                arts.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl text-center shadow-sm">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-black mb-4">
                Quality Excellence
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We maintain the highest standards in material selection,
                construction, and finish to deliver clothing that stands the
                test of time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-full h-96 bg-gradient-to-br from-green-200 via-teal-200 to-blue-200 rounded-2xl flex items-center justify-center">
                <div className="w-32 h-32 bg-white/30 rounded-full"></div>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-black mb-8">Our Values</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-2">
                      Cultural Heritage
                    </h3>
                    <p className="text-gray-600">
                      Preserving and celebrating the rich traditions of
                      Pakistani textile and fashion design.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-2">
                      Sustainability
                    </h3>
                    <p className="text-gray-600">
                      Committed to eco-friendly practices and sustainable
                      production methods that respect our environment.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-2">Innovation</h3>
                    <p className="text-gray-600">
                      Blending traditional craftsmanship with contemporary
                      design to create timeless fashion pieces.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-2">
                      Customer-Centric
                    </h3>
                    <p className="text-gray-600">
                      Your satisfaction and unique style preferences are at the
                      heart of everything we create.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-black text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            DISCOVER YOUR
            <br />
            PERFECT STYLE
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Explore our carefully curated collection of handcrafted garments
            that celebrate your individuality while honoring our shared
            heritage.
          </p>
          <button className="bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors">
            Shop Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-black mb-4">
                DRESSCODE
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Celebrating Pakistani heritage through contemporary fashion and
                handcrafted excellence.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-black mb-4">Shop</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>New Arrivals</div>
                <div>Men&apos;s Collection</div>
                <div>Women&apos;s Collection</div>
                <div>Traditional Wear</div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-black mb-4">Company</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>About Us</div>
                <div>Contact</div>
                <div>Careers</div>
                <div>Press</div>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-black mb-4">Support</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Size Guide</div>
                <div>Shipping Info</div>
                <div>Returns</div>
                <div>FAQ</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-sm text-gray-600">
            © 2024 DRESSCODE. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
