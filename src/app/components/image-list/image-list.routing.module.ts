import {
    ActivatedRoute,
    ActivatedRouteSnapshot,
    CanActivateFn,
    Route,
    Router,
    RouterModule,
    RouterStateSnapshot,
} from '@angular/router';
import { NgModule, inject } from '@angular/core';
import { ImageListComponent } from './image-list.component';
import { ImagePopupComponent } from '../image-popup/image-popup.component';
import { MetadataService } from '../../services/metadata.service';
import { map } from 'rxjs';

const canActivate: CanActivateFn = (routeSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const router = inject(Router);
    const activatedRoute = inject(ActivatedRoute);
    const rootId = Number.parseInt(routeSnapshot.paramMap.get('rootId') ?? '');
    const service = inject(MetadataService);
    return service.getImagesMetadata(isNaN(rootId) ? undefined : rootId).pipe(
        map((x) => {
            if (isNaN(rootId) && x) {
                router.navigate(['imagelist', x.rootId], { relativeTo: activatedRoute });
            }
            return false;
        })
    );
};

const ROUTES: Route[] = [
    {
        path: 'imagelist/:rootId',
        component: ImageListComponent,
        children: [{ path: ':id', component: ImagePopupComponent }],
    },
    {
        path: 'imagelist',
        component: ImageListComponent,
        canActivate: [canActivate],
    },
];

@NgModule({
    imports: [RouterModule.forChild(ROUTES)],
    exports: [RouterModule],
})
export class ImageListRoutingModule {}
