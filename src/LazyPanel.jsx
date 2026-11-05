import React from 'react';
export default function LazyPanel() {
  return (
    <div className="lazy-inner">
      <div className="lazy-icon">↗</div>
      <div>
        <span className="eyebrow">LAZY LOADED COMPONENT</span>
        <h3>Yalnızca ihtiyacın olduğunda yüklenir.</h3>
        <p>Bu panel <code>React.lazy()</code> ve <code>Suspense</code> kullanır. Ekrana yaklaştığında JavaScript modülü indirilir. Görüldükten sonra sayfada kalır.</p>
      </div>
      <span className="loaded-pill">● Yüklendi</span>
    </div>
  );
}
