import Checklist from "./Checklist";

const floodItems = [
  { id: '1', text: 'Move to higher ground immediately.' },
  { id: '2', text: 'Avoid walking or driving through floodwaters.' },
  { id: '3', text: 'Stay informed through local news and weather updates.' },
  { id: '4', text: 'Have an emergency kit ready with essentials.' },
  { id: '5', text: 'Follow evacuation orders from authorities.' },
];

export default function FloodChecklist() {
  return (
    <Checklist 
      title="Flood Preparedness Checklist"
      items={floodItems}
      storageKey="floodChecklist"
    />
  );
}