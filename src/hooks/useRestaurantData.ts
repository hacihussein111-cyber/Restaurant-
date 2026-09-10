import { useState, useEffect, useCallback } from 'react';
import { MenuCategory, MenuItem, RestaurantInfo, TableReservation } from '../types';
import { DEFAULT_CATEGORIES, DEFAULT_MENU_ITEMS, DEFAULT_RESTAURANT_INFO } from '../data/defaultData';

const STORAGE_KEY_ITEMS = 'restaurant_cms_menu_items_v1';
const STORAGE_KEY_CATEGORIES = 'restaurant_cms_categories_v1';
const STORAGE_KEY_INFO = 'restaurant_cms_info_v1';
const STORAGE_KEY_RESERVATIONS = 'restaurant_cms_reservations_v1';

export function useRestaurantData() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ITEMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading menu items from localStorage:', e);
    }
    return DEFAULT_MENU_ITEMS;
  });

  const [categories, setCategories] = useState<MenuCategory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading categories from localStorage:', e);
    }
    return DEFAULT_CATEGORIES;
  });

  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INFO);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading restaurant info from localStorage:', e);
    }
    return DEFAULT_RESTAURANT_INFO;
  });

  const [reservations, setReservations] = useState<TableReservation[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RESERVATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading reservations from localStorage:', e);
    }
    return [];
  });

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(menuItems));
    } catch (e) {
      console.error('Could not save items to localStorage:', e);
    }
  }, [menuItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Could not save categories to localStorage:', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INFO, JSON.stringify(restaurantInfo));
    } catch (e) {
      console.error('Could not save info to localStorage:', e);
    }
  }, [restaurantInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RESERVATIONS, JSON.stringify(reservations));
    } catch (e) {
      console.error('Could not save reservations to localStorage:', e);
    }
  }, [reservations]);

  // Dish Operations
  const addDish = useCallback((dish: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...dish,
      id: 'dish_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    };
    setMenuItems((prev) => [newItem, ...prev]);
    return newItem;
  }, []);

  const updateDish = useCallback((id: string, updates: Partial<MenuItem>) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const deleteDish = useCallback((id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toggleDishAvailability = useCallback((id: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  }, []);

  const toggleDailySpecial = useCallback((id: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isDailySpecial: !item.isDailySpecial } : item
      )
    );
  }, []);

  const toggleChefSpecial = useCallback((id: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isChefSpecial: !item.isChefSpecial } : item
      )
    );
  }, []);

  // Category Operations
  const addCategory = useCallback((name: string, description?: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_') + '_' + Date.now().toString(36);
    const newCategory: MenuCategory = {
      id: slug,
      name,
      description,
      order: categories.length + 1,
    };
    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  }, [categories.length]);

  const updateCategory = useCallback((id: string, updates: Partial<MenuCategory>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    // Move dishes in this category to first available category
    const remaining = categories.filter((c) => c.id !== id);
    const fallbackId = remaining.length > 0 ? remaining[0].id : 'uncategorized';
    setMenuItems((prev) =>
      prev.map((item) =>
        item.category === id ? { ...item, category: fallbackId } : item
      )
    );
  }, [categories]);

  // Restaurant Info Operations
  const updateRestaurantInfo = useCallback((updates: Partial<RestaurantInfo>) => {
    setRestaurantInfo((prev) => ({ ...prev, ...updates }));
  }, []);

  // Reservation Operations
  const addReservation = useCallback(
    (data: Omit<TableReservation, 'id' | 'createdAt' | 'status'>) => {
      const newReservation: TableReservation = {
        ...data,
        id: 'res_' + Date.now(),
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
      setReservations((prev) => [newReservation, ...prev]);
      return newReservation;
    },
    []
  );

  // Backup & Reset
  const resetToDefaults = useCallback(() => {
    setMenuItems(DEFAULT_MENU_ITEMS);
    setCategories(DEFAULT_CATEGORIES);
    setRestaurantInfo(DEFAULT_RESTAURANT_INFO);
    localStorage.removeItem(STORAGE_KEY_ITEMS);
    localStorage.removeItem(STORAGE_KEY_CATEGORIES);
    localStorage.removeItem(STORAGE_KEY_INFO);
  }, []);

  const exportDataJson = useCallback(() => {
    return JSON.stringify(
      {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        restaurantInfo,
        categories,
        menuItems,
      },
      null,
      2
    );
  }, [restaurantInfo, categories, menuItems]);

  const importDataJson = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.menuItems && Array.isArray(parsed.menuItems)) {
        setMenuItems(parsed.menuItems);
      }
      if (parsed.categories && Array.isArray(parsed.categories)) {
        setCategories(parsed.categories);
      }
      if (parsed.restaurantInfo && typeof parsed.restaurantInfo === 'object') {
        setRestaurantInfo(parsed.restaurantInfo);
      }
      return true;
    } catch (e) {
      console.error('Failed to parse imported JSON:', e);
      return false;
    }
  }, []);

  return {
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
  };
}
