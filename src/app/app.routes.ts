import { Route } from '@angular/router';
import { ImageComponent } from './components/image/image.component';
import { PlaceholderComponent } from './components/placeholder/placeholder.component';

export const appRoutes: Route[] = [
    {
        path: 'image/:id', component: ImageComponent,
    },{
        path: 'placeholder', component: PlaceholderComponent,
    }
    
];
