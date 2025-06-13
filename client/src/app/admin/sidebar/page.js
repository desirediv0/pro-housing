"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label, Switch } from "@/components/ui/form";
import {
  Layout,
  Menu,
  Settings,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  GripVertical,
  Save,
  RefreshCw,
  Home,
  Building,
  Users,
  MessageSquare,
  BarChart3,
  Shield,
  FileText,
  HelpCircle,
  Bell,
  Search,
  Archive,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import toast from "react-hot-toast";

export default function SidebarManagement() {
  const [loading, setLoading] = useState(false);
  const [sidebarConfig, setSidebarConfig] = useState({
    collapsed: false,
    theme: "light",
    position: "left",
    width: 280,
    showIcons: true,
    showLabels: true,
    animation: true,
  });

  const [menuItems, setMenuItems] = useState([
    {
      id: "1",
      label: "Dashboard",
      icon: "Home",
      path: "/admin/dashboard",
      visible: true,
      order: 1,
      hasSubmenu: false,
      submenu: [],
    },
    {
      id: "2",
      label: "Properties",
      icon: "Building",
      path: "/admin/properties",
      visible: true,
      order: 2,
      hasSubmenu: true,
      submenu: [
        {
          id: "2a",
          label: "All Properties",
          path: "/admin/properties",
          visible: true,
        },
        {
          id: "2b",
          label: "Add Property",
          path: "/admin/properties/create",
          visible: true,
        },
        {
          id: "2c",
          label: "Categories",
          path: "/admin/properties/categories",
          visible: true,
        },
        {
          id: "2d",
          label: "Featured",
          path: "/admin/properties/featured",
          visible: true,
        },
      ],
    },
    {
      id: "3",
      label: "Analytics",
      icon: "BarChart3",
      path: "/admin/analytics",
      visible: true,
      order: 3,
      hasSubmenu: false,
      submenu: [],
    },
    {
      id: "4",
      label: "Inquiries",
      icon: "MessageSquare",
      path: "/admin/inquiries",
      visible: true,
      order: 4,
      hasSubmenu: false,
      submenu: [],
    },
    {
      id: "5",
      label: "Users",
      icon: "Users",
      path: "/admin/users",
      visible: true,
      order: 5,
      hasSubmenu: true,
      submenu: [
        { id: "5a", label: "All Users", path: "/admin/users", visible: true },
        {
          id: "5b",
          label: "Agents",
          path: "/admin/users/agents",
          visible: true,
        },
        {
          id: "5c",
          label: "Customers",
          path: "/admin/users/customers",
          visible: true,
        },
      ],
    },
    {
      id: "6",
      label: "Reports",
      icon: "FileText",
      path: "/admin/reports",
      visible: true,
      order: 6,
      hasSubmenu: false,
      submenu: [],
    },
    {
      id: "7",
      label: "Settings",
      icon: "Settings",
      path: "/admin/settings",
      visible: true,
      order: 7,
      hasSubmenu: false,
      submenu: [],
    },
  ]);

  const [newMenuItem, setNewMenuItem] = useState({
    label: "",
    icon: "Menu",
    path: "",
    visible: true,
    hasSubmenu: false,
  });

  const iconOptions = [
    { value: "Home", label: "Home" },
    { value: "Building", label: "Building" },
    { value: "Users", label: "Users" },
    { value: "MessageSquare", label: "Messages" },
    { value: "BarChart3", label: "Analytics" },
    { value: "Settings", label: "Settings" },
    { value: "FileText", label: "Reports" },
    { value: "Shield", label: "Security" },
    { value: "Bell", label: "Notifications" },
    { value: "Search", label: "Search" },
    { value: "Archive", label: "Archive" },
    { value: "HelpCircle", label: "Help" },
  ];

  useEffect(() => {
    loadSidebarConfig();
  }, []);

  const loadSidebarConfig = async () => {
    try {
      setLoading(true);
      // Load sidebar configuration from API
      // const response = await adminAPI.getSidebarConfig();
      // setSidebarConfig(response.data.data.config);
      // setMenuItems(response.data.data.menuItems);
    } catch (error) {
      console.error("Error loading sidebar config:", error);
      toast.error("Failed to load sidebar configuration");
    } finally {
      setLoading(false);
    }
  };

  const saveSidebarConfig = async () => {
    try {
      setLoading(true);
      // await adminAPI.updateSidebarConfig({ config: sidebarConfig, menuItems });
      toast.success("Sidebar configuration saved successfully!", {
        icon: "💾",
        style: {
          borderRadius: "10px",
          background: "#10B981",
          color: "#fff",
        },
      });
    } catch (error) {
      toast.error("Failed to save sidebar configuration", {
        icon: "❌",
        style: {
          borderRadius: "10px",
          background: "#EF4444",
          color: "#fff",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(menuItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    setMenuItems(updatedItems);
  };

  const toggleMenuItemVisibility = (itemId) => {
    setMenuItems((items) =>
      items.map((item) =>
        item.id === itemId ? { ...item, visible: !item.visible } : item
      )
    );
  };

  const deleteMenuItem = (itemId) => {
    setMenuItems((items) => items.filter((item) => item.id !== itemId));
    toast.success("Menu item deleted successfully");
  };

  const addMenuItem = () => {
    if (!newMenuItem.label || !newMenuItem.path) {
      toast.error("Label and path are required");
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      ...newMenuItem,
      order: menuItems.length + 1,
      submenu: [],
    };

    setMenuItems([...menuItems, newItem]);
    setNewMenuItem({
      label: "",
      icon: "Menu",
      path: "",
      visible: true,
      hasSubmenu: false,
    });
    toast.success("Menu item added successfully");
  };

  const IconComponent = ({ iconName, className = "h-5 w-5" }) => {
    const icons = {
      Home,
      Building,
      Users,
      MessageSquare,
      BarChart3,
      Settings,
      FileText,
      Shield,
      Bell,
      Search,
      Archive,
      HelpCircle,
      Menu,
    };
    const Icon = icons[iconName] || Menu;
    return <Icon className={className} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Sidebar Management
          </h1>
          <p className="text-gray-600 mt-1">
            Customize your admin sidebar layout and navigation
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={loadSidebarConfig}
            variant="outline"
            size="sm"
            className="hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={saveSidebarConfig}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </div>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar Configuration */}
        <Card className="lg:col-span-1 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-200">
            <CardTitle className="flex items-center text-gray-900">
              <Layout className="h-5 w-5 mr-2 text-indigo-600" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* General Settings */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">General Settings</h3>

              <div className="flex items-center justify-between">
                <Label htmlFor="collapsed">Collapsed by Default</Label>
                <Switch
                  id="collapsed"
                  checked={sidebarConfig.collapsed}
                  onCheckedChange={(checked) =>
                    setSidebarConfig((prev) => ({
                      ...prev,
                      collapsed: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showIcons">Show Icons</Label>
                <Switch
                  id="showIcons"
                  checked={sidebarConfig.showIcons}
                  onCheckedChange={(checked) =>
                    setSidebarConfig((prev) => ({
                      ...prev,
                      showIcons: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showLabels">Show Labels</Label>
                <Switch
                  id="showLabels"
                  checked={sidebarConfig.showLabels}
                  onCheckedChange={(checked) =>
                    setSidebarConfig((prev) => ({
                      ...prev,
                      showLabels: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="animation">Enable Animation</Label>
                <Switch
                  id="animation"
                  checked={sidebarConfig.animation}
                  onCheckedChange={(checked) =>
                    setSidebarConfig((prev) => ({
                      ...prev,
                      animation: checked,
                    }))
                  }
                />
              </div>
            </div>

            {/* Appearance */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Appearance</h3>

              <div>
                <Label htmlFor="theme">Theme</Label>
                <select
                  id="theme"
                  value={sidebarConfig.theme}
                  onChange={(e) =>
                    setSidebarConfig((prev) => ({
                      ...prev,
                      theme: e.target.value,
                    }))
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div>
                <Label htmlFor="position">Position</Label>
                <select
                  id="position"
                  value={sidebarConfig.position}
                  onChange={(e) =>
                    setSidebarConfig((prev) => ({
                      ...prev,
                      position: e.target.value,
                    }))
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>

              <div>
                <Label htmlFor="width">Width (px)</Label>
                <Input
                  id="width"
                  type="number"
                  value={sidebarConfig.width}
                  onChange={(e) =>
                    setSidebarConfig((prev) => ({
                      ...prev,
                      width: parseInt(e.target.value),
                    }))
                  }
                  min="200"
                  max="400"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Add New Menu Item */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-semibold text-gray-900">Add Menu Item</h3>

              <div>
                <Label htmlFor="newLabel">Label</Label>
                <Input
                  id="newLabel"
                  value={newMenuItem.label}
                  onChange={(e) =>
                    setNewMenuItem((prev) => ({
                      ...prev,
                      label: e.target.value,
                    }))
                  }
                  placeholder="Menu item label"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="newIcon">Icon</Label>
                <select
                  id="newIcon"
                  value={newMenuItem.icon}
                  onChange={(e) =>
                    setNewMenuItem((prev) => ({
                      ...prev,
                      icon: e.target.value,
                    }))
                  }
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {iconOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="newPath">Path</Label>
                <Input
                  id="newPath"
                  value={newMenuItem.path}
                  onChange={(e) =>
                    setNewMenuItem((prev) => ({
                      ...prev,
                      path: e.target.value,
                    }))
                  }
                  placeholder="/admin/new-page"
                  className="mt-1"
                />
              </div>

              <Button
                onClick={addMenuItem}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Menu Item
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items Management */}
        <Card className="lg:col-span-2 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <CardTitle className="flex items-center text-gray-900">
              <Menu className="h-5 w-5 mr-2 text-blue-600" />
              Menu Items
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="menuItems">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {menuItems
                      .sort((a, b) => a.order - b.order)
                      .map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`p-4 bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200 ${
                                snapshot.isDragging
                                  ? "shadow-lg scale-105"
                                  : "hover:shadow-md"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="cursor-grab"
                                  >
                                    <GripVertical className="h-5 w-5 text-gray-400" />
                                  </div>

                                  <IconComponent
                                    iconName={item.icon}
                                    className="h-5 w-5 text-gray-600"
                                  />

                                  <div>
                                    <h4 className="font-medium text-gray-900">
                                      {item.label}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                      {item.path}
                                    </p>
                                    {item.hasSubmenu && (
                                      <p className="text-xs text-indigo-600">
                                        {item.submenu.length} submenu items
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      toggleMenuItemVisibility(item.id)
                                    }
                                    className={`${
                                      item.visible
                                        ? "text-green-600 hover:text-green-700"
                                        : "text-gray-400 hover:text-gray-500"
                                    }`}
                                  >
                                    {item.visible ? (
                                      <Eye className="h-4 w-4" />
                                    ) : (
                                      <EyeOff className="h-4 w-4" />
                                    )}
                                  </Button>

                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => deleteMenuItem(item.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* Submenu Items */}
                              {item.hasSubmenu && item.submenu.length > 0 && (
                                <div className="mt-3 ml-8 space-y-2">
                                  {item.submenu.map((subItem) => (
                                    <div
                                      key={subItem.id}
                                      className="flex items-center justify-between p-2 bg-gray-50 rounded border-l-4 border-indigo-200"
                                    >
                                      <div>
                                        <span className="text-sm font-medium text-gray-700">
                                          {subItem.label}
                                        </span>
                                        <span className="text-xs text-gray-500 ml-2">
                                          {subItem.path}
                                        </span>
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className={`${
                                          subItem.visible
                                            ? "text-green-600"
                                            : "text-gray-400"
                                        }`}
                                      >
                                        {subItem.visible ? (
                                          <Eye className="h-3 w-3" />
                                        ) : (
                                          <EyeOff className="h-3 w-3" />
                                        )}
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar Preview */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
          <CardTitle className="flex items-center text-gray-900">
            <Eye className="h-5 w-5 mr-2 text-green-600" />
            Sidebar Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-gray-100 rounded-lg p-4">
            <div
              className="bg-white rounded-lg shadow-md"
              style={{ width: sidebarConfig.width }}
            >
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-bold text-lg text-gray-900">
                  Pro Housing Admin
                </h3>
              </div>
              <nav className="p-2">
                {menuItems
                  .filter((item) => item.visible)
                  .sort((a, b) => a.order - b.order)
                  .map((item) => (
                    <div key={item.id} className="mb-1">
                      <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                        {sidebarConfig.showIcons && (
                          <IconComponent
                            iconName={item.icon}
                            className="h-5 w-5 text-gray-600"
                          />
                        )}
                        {sidebarConfig.showLabels && (
                          <span className="text-gray-700 font-medium">
                            {item.label}
                          </span>
                        )}
                      </div>
                      {item.hasSubmenu &&
                        item.submenu.filter((sub) => sub.visible).length >
                          0 && (
                          <div className="ml-6 space-y-1">
                            {item.submenu
                              .filter((sub) => sub.visible)
                              .map((subItem) => (
                                <div
                                  key={subItem.id}
                                  className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
                                >
                                  {sidebarConfig.showLabels && subItem.label}
                                </div>
                              ))}
                          </div>
                        )}
                    </div>
                  ))}
              </nav>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
