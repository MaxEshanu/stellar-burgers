import { useState, useRef, useEffect, FC, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { TTabMode, TIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';
import { getIngredientState } from '../../services/slices/ingredientSlice';

export const BurgerIngredients: FC = () => {
  const { ingredients } = useSelector(getIngredientState);

  const categorizedIngredients = useMemo(
    () =>
      ingredients.reduce<Record<TTabMode, TIngredient[]>>(
        (acc, item) => {
          (acc[item.type as TTabMode] = acc[item.type as TTabMode] || []).push(
            item
          );
          return acc;
        },
        { bun: [], main: [], sauce: [] }
      ),
    [ingredients]
  );

  const [activeTab, setActiveTab] = useState<TTabMode>('bun');
  const sectionRefs = {
    bun: useRef<HTMLHeadingElement>(null),
    main: useRef<HTMLHeadingElement>(null),
    sauce: useRef<HTMLHeadingElement>(null)
  };

  const observerOptions = useMemo(() => ({ threshold: 0 }), []);
  const [bunObserver, isBunVisible] = useInView(observerOptions);
  const [sauceObserver, isSauceVisible] = useInView(observerOptions);
  const [mainObserver, isMainVisible] = useInView(observerOptions);

  useEffect(() => {
    const visibilityMap = {
      bun: isBunVisible,
      sauce: isSauceVisible,
      main: isMainVisible
    };
    const newActiveTab = Object.entries(visibilityMap).find(
      ([, isVisible]) => isVisible
    )?.[0] as TTabMode;
    if (newActiveTab) setActiveTab(newActiveTab);
  }, [isBunVisible, isSauceVisible, isMainVisible]);

  const onTabClick = (tab: string) => {
    setActiveTab(tab as TTabMode);
    sectionRefs[tab as TTabMode].current?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <BurgerIngredientsUI
      currentTab={activeTab}
      buns={categorizedIngredients.bun}
      mains={categorizedIngredients.main}
      sauces={categorizedIngredients.sauce}
      titleBunRef={sectionRefs.bun}
      titleMainRef={sectionRefs.main}
      titleSaucesRef={sectionRefs.sauce}
      bunsRef={bunObserver}
      mainsRef={mainObserver}
      saucesRef={sauceObserver}
      onTabClick={onTabClick}
    />
  );
};
