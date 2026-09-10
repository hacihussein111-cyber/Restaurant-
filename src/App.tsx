import React, { useState } from 'react';
import { useRestaurantData } from './hooks/useRestaurantData';
import { Navbar } from './components/public/Navbar';
import { Hero } from './components/public/Hero';
import { DailySpecials } from './components/public/DailySpecials';
import { MenuSection } from './components/public/MenuSection';
import { ReservationSection } from './components/public/ReservationSection';
import { AboutAndLocation } from './components/public/AboutAndLocation';
import { Footer } from './components/public/Footer';
import { AdminBar } from './components/cms/AdminBar';
import { DishEditModal } from './components/cms/DishEditModal';
import { CmsModal } from './components/cms/CmsModal';
import { MenuItem } from './types';

export default function App() {
  const {
    menuItems,
    categories,
    restaurantInfo,
    reservations,
    addDish,
    updateDish,
    deleteDish,
    toggleDishAvailability,
    toggleDailySpecial,
    toggleChefSpecial,
    addCategory,
    updateCategory,
    deleteCategory,
    updateRestaurantInfo,
    addReservation,
    resetToDefaults,
    exportDataJson,
    importDataJson,
  } = useRestaurantData();

  // CMS view states
  const [cmsModeActive, setCmsModeActive] = useState(true);
  const [isCmsModalOpen, setIsCmsModalOpen] = useState(false);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [dishToEdit, setDishToEdit] = useState<MenuItem | null>(null);
  const [targetCategoryId, setTargetCategoryId] = useState<string | undefined>(undefined);

  const handleOpenEditDish = (dish: MenuItem) => {
    setDishToEdit(dish);
    setTargetCategoryId(dish.category);
    setIsDishModalOpen(true);
  };

  const handleOpenAddDish = (categoryId?: string) => {
    setDishToEdit(null);
    setTargetCategoryId(categoryId || categories[0]?.id);
    setIsDishModalOpen(true);
  };

  const handleSaveDish = (dishData: Omit<MenuItem, 'id'>, id?: string) => {
    if (id) {
      updateDish(id, dishData);
    } else {
      addDish(dishData);
    }
  };

  const specialsCount = menuItems.filter((i) => i.isDailySpecial || i.isChefSpecial).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-[#1c1917] selection:bg-[#c2410c]/20 selection:text-[#9a3412]">
      {/* Navigation */}
      <Navbar
        restaurantInfo={restaurantInfo}
        onOpenCms={() => setIsCmsModalOpen(true)}
        onOpenDishModal={() => handleOpenAddDish()}
        cmsModeActive={cmsModeActive}
        onToggleCmsMode={() => setCmsModeActive(!cmsModeActive)}
      />

      <main className="flex-1 pb-24">
        {/* Hero Section */}
        <Hero
          restaurantInfo={restaurantInfo}
          onOpenCms={() => setIsCmsModalOpen(true)}
          onOpenAddDish={() => handleOpenAddDish()}
        />

        {/* Daily Specials / Chef Recommendations */}
        <DailySpecials
          items={menuItems}
          restaurantInfo={restaurantInfo}
          cmsModeActive={cmsModeActive}
          onEditDish={handleOpenEditDish}
          onOpenCms={() => setIsCmsModalOpen(true)}
        />

        {/* Full Interactive Menu Section */}
        <MenuSection
          categories={categories}
          items={menuItems}
          restaurantInfo={restaurantInfo}
          cmsModeActive={cmsModeActive}
          onEditDish={handleOpenEditDish}
          onAddDishToCategory={(catId) => handleOpenAddDish(catId)}
          onOpenCms={() => setIsCmsModalOpen(true)}
        />

        {/* Online Table Booking */}
        <ReservationSection
          restaurantInfo={restaurantInfo}
          onAddReservation={addReservation}
        />

        {/* About & Philosophy & Opening Hours */}
        <AboutAndLocation restaurantInfo={restaurantInfo} />
      </main>

      {/* Footer */}
      <Footer
        restaurantInfo={restaurantInfo}
        onOpenCms={() => setIsCmsModalOpen(true)}
      />

      {/* Floating CMS Quick Bar */}
      <AdminBar
        cmsModeActive={cmsModeActive}
        onToggleCmsMode={() => setCmsModeActive(!cmsModeActive)}
        onOpenCmsModal={() => setIsCmsModalOpen(true)}
        onOpenAddDishModal={() => handleOpenAddDish()}
        itemsCount={menuItems.length}
        categoriesCount={categories.length}
        specialsCount={specialsCount}
      />

      {/* Modal for adding/editing a dish */}
      <DishEditModal
        isOpen={isDishModalOpen}
        onClose={() => setIsDishModalOpen(false)}
        dishToEdit={dishToEdit}
        defaultCategoryId={targetCategoryId}
        categories={categories}
        currency={restaurantInfo.currency}
        onSave={handleSaveDish}
        onAddCategory={(name) => addCategory(name)}
      />

      {/* Comprehensive CMS Dashboard Modal */}
      <CmsModal
        isOpen={isCmsModalOpen}
        onClose={() => setIsCmsModalOpen(false)}
        menuItems={menuItems}
        categories={categories}
        restaurantInfo={restaurantInfo}
        reservations={reservations}
        onOpenDishModal={(dish, defaultCat) => {
          setDishToEdit(dish || null);
          setTargetCategoryId(defaultCat || categories[0]?.id);
          setIsDishModalOpen(true);
        }}
        onDeleteDish={deleteDish}
        onToggleAvailability={toggleDishAvailability}
        onToggleDailySpecial={toggleDailySpecial}
        onToggleChefSpecial={toggleChefSpecial}
        onAddCategory={addCategory}
        onUpdateCategory={updateCategory}
        onDeleteCategory={deleteCategory}
        onUpdateRestaurantInfo={updateRestaurantInfo}
        onResetToDefaults={resetToDefaults}
        onExportData={exportDataJson}
        onImportData={importDataJson}
      />
    </div>
  );
}
