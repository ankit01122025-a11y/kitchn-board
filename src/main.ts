import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';
import { categoryReducer } from './app/core/store/category/category.reducer';
import { CategoryEffects } from './app/core/store/category/category.effects';
import { itemReducer } from './app/core/store/item/item.reducer';
import { ItemEffects } from './app/core/store/item/item.effects';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideStore({
      categories: categoryReducer,
      items: itemReducer
    }),
    provideEffects([
      CategoryEffects,
      ItemEffects
    ]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode()
    })
  ]
});
