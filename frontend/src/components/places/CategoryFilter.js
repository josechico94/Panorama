"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CategoryFilter;
var framer_motion_1 = require("framer-motion");
var types_1 = require("@/types");
var store_1 = require("@/store");
function CategoryFilter() {
    var _a = (0, store_1.useAppStore)(), activeCategory = _a.activeCategory, setActiveCategory = _a.setActiveCategory;
    return (<div className="flex gap-2 overflow-x-auto no-scrollbar">
      <framer_motion_1.motion.button whileTap={{ scale: 0.93 }} onClick={function () { return setActiveCategory(null); }} className={"shrink-0 cat-pill transition-all duration-200 ".concat(activeCategory === null
            ? 'bg-[var(--text)] text-[var(--bg)] border-transparent'
            : 'bg-transparent text-[var(--text-2)] border-[var(--border2)] hover:border-[var(--text-3)] hover:text-[var(--text)]')}>
        Tutti
      </framer_motion_1.motion.button>

      {types_1.CATEGORIES.map(function (cat) {
            var isActive = activeCategory === cat.id;
            return (<framer_motion_1.motion.button key={cat.id} whileTap={{ scale: 0.93 }} onClick={function () { return setActiveCategory(isActive ? null : cat.id); }} className="shrink-0 cat-pill" style={isActive
                    ? {
                        backgroundColor: cat.color,
                        color: '#fff',
                        borderColor: 'transparent',
                        boxShadow: "0 4px 20px ".concat(cat.color, "55"),
                    }
                    : {
                        backgroundColor: "".concat(cat.color, "14"),
                        color: cat.color,
                        borderColor: "".concat(cat.color, "35"),
                    }}>
            <span style={{ fontSize: '11px' }}>{cat.emoji}</span>
            {cat.label}
          </framer_motion_1.motion.button>);
        })}
    </div>);
}
