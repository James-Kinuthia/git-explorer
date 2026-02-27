import { Text, View } from 'react-native';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import { RepoFilterProps } from '@/types/repo';
import { ArrowDownWideNarrow, SortAsc, SortDesc } from 'lucide-react-native';
import { useState } from 'react';

export default function RepoFilters({ sort, order, onSortChange, onOrderChange, disabled }: RepoFilterProps) {
    const [openSort, setOpenSort] = useState(false);
    const [sortValue, setSortValue] = useState<RepoFilterProps['sort']>(sort ?? 'stars');
    const [sortItems] = useState<ItemType<string>[]>([
        { label: 'Stars', value: 'stars' },
        { label: 'Forks', value: 'forks' },
        { label: 'Updated', value: 'updates' },
        { label: 'Help Wanted Issues', value: 'help-wanted-issues' },
    ]);

    const [openOrder, setOpenOrder] = useState(false);
    const [orderValue, setOrderValue] = useState<RepoFilterProps['order']>(order ?? 'desc');
    const [orderItems] = useState<ItemType<string>[]>([
        { label: 'Descending', value: 'desc', icon: () => <SortDesc size={16} color={"#9ca3af"} />},
        { label: 'Ascending', value: 'asc', icon: () => <SortAsc size={16} color={"#9ca3af"} /> },
    ]);

    return (
        <View className="flex-1 flex-row flex-wrap items-center gap-4 mb-8 justify-center">
            <View className="flex-row mx-auto items-center gap-2">
                <SortAsc color={"#9ca3af"}/>
                <Text className="text-gray-400 text-sm">Sort by:</Text>
                <DropDownPicker
                    disabled={disabled}
                    open={openSort}
                    value={sortValue ?? null}
                    items={sortItems}
                    setOpen={setOpenSort}
                    setValue={(val) => {
                        const newVal = val(sortValue ?? null) as NonNullable<RepoFilterProps['sort']>;
                        setSortValue(newVal);
                        onSortChange(newVal);
                    }}
                    setItems={() => { }}
                    style={{width: '50%'}}
                />
            </View>
            <View className="flex-row mx-auto items-center gap-2">
                <ArrowDownWideNarrow color={"#9ca3af"} />
                <Text className="text-gray-400 text-sm">Order:</Text>
                <DropDownPicker
                    disabled={disabled}
                    style={{width: '50%'}}
                    open={openOrder}
                    value={orderValue ?? null}
                    items={orderItems}
                    setOpen={setOpenOrder}
                    setValue={(val) => {
                        const newVal = val(orderValue ?? null) as NonNullable<RepoFilterProps['order']>
                        setOrderValue(newVal);
                        onOrderChange(newVal);
                    }}
                    setItems={() => { }}
                />
            </View>
        </View>
    );
}