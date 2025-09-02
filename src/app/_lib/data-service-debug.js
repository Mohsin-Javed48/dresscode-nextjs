import { eachDayOfInterval } from "date-fns";
import { supabase } from "./supabase";

/////////////
// GET - WITH DEBUG LOGGING

export async function getCabin(id) {
  console.log("🔍 DEBUG: Fetching cabin with ID:", id);
  const { data, error } = await supabase
    .from("cabins")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("❌ ERROR fetching cabin:", error);
    console.error("❌ ERROR details:", error.message, error.code);
  } else {
    console.log("✅ SUCCESS: Cabin data received:", data);
  }

  return data;
}

export async function getCabinPrice(id) {
  const { data, error } = await supabase
    .from("cabins")
    .select("regularPrice, discount")
    .eq("id", id)
    .single();

  if (error) {
    console.error("❌ ERROR fetching cabin price:", error);
  }

  return data;
}

export const getCabins = async function () {
  console.log("🔍 DEBUG: Starting getCabins()...");
  console.log("🔍 DEBUG: SUPABASE_URL exists:", !!process.env.SUPABASE_URL);
  console.log("🔍 DEBUG: SUPABASE_KEY exists:", !!process.env.SUPABASE_KEY);

  try {
    const { data, error } = await supabase
      .from("cabins")
      .select("id, name, maxCapacity, regularPrice, discount, image")
      .order("name");

    if (error) {
      console.error("❌ ERROR fetching cabins:", error);
      console.error("❌ ERROR message:", error.message);
      console.error("❌ ERROR code:", error.code);
      console.error("❌ ERROR details:", error.details);
      throw new Error("Cabins could not be loaded");
    }

    console.log("✅ SUCCESS: Cabins data received:", data);
    console.log("📊 COUNT: Number of cabins:", data ? data.length : 0);

    if (data && data.length > 0) {
      console.log("📝 SAMPLE: First cabin:", data[0]);
    }

    return data;
  } catch (error) {
    console.error("💥 CRITICAL ERROR in getCabins():", error);
    throw error;
  }
};

// Test connection function
export async function testSupabaseConnection() {
  console.log("🧪 TESTING: Supabase connection...");
  try {
    const { data, error } = await supabase.from("cabins").select("*").limit(1);

    if (error) {
      console.error("🧪 TEST FAILED:", error);
      return false;
    }

    console.log("🧪 TEST SUCCESS: Connected to Supabase");
    console.log("🧪 TEST DATA:", data);
    return true;
  } catch (error) {
    console.error("🧪 TEST CRITICAL ERROR:", error);
    return false;
  }
}

// Guests are uniquely identified by their email address
export async function getGuest(email) {
  console.log("🔍 DEBUG: Fetching guest with email:", email);
  const { data, error } = await supabase
    .from("guests")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error("❌ ERROR fetching guest:", error);
  } else {
    console.log("✅ SUCCESS: Guest data received:", data);
  }

  return data;
}

export async function getBooking(id) {
  const { data, error, count } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("❌ ERROR fetching booking:", error);
    throw new Error("Booking could not get loaded");
  }

  return data;
}

export async function getBookings(guestId) {
  const { data, error, count } = await supabase
    .from("bookings")
    .select(
      "id, created_at, startDate, endDate, numNights, numGuests, totalPrice, guestId, cabinId, cabins(name, image)"
    )
    .eq("guestId", guestId)
    .order("startDate");

  if (error) {
    console.error("❌ ERROR fetching bookings:", error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

export async function getBookedDatesByCabinId(cabinId) {
  let today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  today = today.toISOString();

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("cabinId", cabinId)
    .or(`startDate.gte.${today},status.eq.checked-in`);

  if (error) {
    console.error("❌ ERROR fetching booked dates:", error);
    throw new Error("Bookings could not get loaded");
  }

  const bookedDates = data
    .map((booking) => {
      return eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
    })
    .flat();

  return bookedDates;
}

export async function getSettings() {
  console.log("🔍 DEBUG: Fetching settings...");
  const { data, error } = await supabase.from("settings").select("*").single();

  if (error) {
    console.error("❌ ERROR fetching settings:", error);
    throw new Error("Settings could not be loaded");
  }

  console.log("✅ SUCCESS: Settings data received:", data);
  return data;
}

export async function getCountries() {
  try {
    const res = await fetch(
      "https://restcountries.com/v2/all?fields=name,flag"
    );
    const countries = await res.json();
    return countries;
  } catch {
    throw new Error("Could not fetch countries");
  }
}

/////////////
// CREATE

export async function createGuest(newGuest) {
  console.log("📝 CREATING: Guest:", newGuest);
  const { data, error } = await supabase.from("guests").insert([newGuest]);

  if (error) {
    console.error("❌ ERROR creating guest:", error);
    throw new Error("Guest could not be created");
  }

  console.log("✅ SUCCESS: Guest created:", data);
  return data;
}

export async function createBooking(newBooking) {
  console.log("📝 CREATING: Booking:", newBooking);
  const { data, error } = await supabase
    .from("bookings")
    .insert([newBooking])
    .select()
    .single();

  if (error) {
    console.error("❌ ERROR creating booking:", error);
    throw new Error("Booking could not be created");
  }

  console.log("✅ SUCCESS: Booking created:", data);
  return data;
}

/////////////
// UPDATE

export async function updateGuest(id, updatedFields) {
  console.log("📝 UPDATING: Guest:", id, updatedFields);
  const { data, error } = await supabase
    .from("guests")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("❌ ERROR updating guest:", error);
    throw new Error("Guest could not be updated");
  }

  console.log("✅ SUCCESS: Guest updated:", data);
  return data;
}

export async function updateBooking(id, updatedFields) {
  console.log("📝 UPDATING: Booking:", id, updatedFields);
  const { data, error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("❌ ERROR updating booking:", error);
    throw new Error("Booking could not be updated");
  }

  console.log("✅ SUCCESS: Booking updated:", data);
  return data;
}

/////////////
// DELETE

export async function deleteBooking(id) {
  console.log("🗑️ DELETING: Booking:", id);
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error("❌ ERROR deleting booking:", error);
    throw new Error("Booking could not be deleted");
  }

  console.log("✅ SUCCESS: Booking deleted:", data);
  return data;
}
